import express from 'express';
import multer from 'multer';
import s3 from 's3';
import sharp from 'sharp';
import slug from 'slug';

import App from '../../models/App';
import categories from '../../constants/categories';
import convertToIcns from '../../libs/convertToIcns';
import convertToIco from '../../libs/convertToIco';

const admin = express.Router();

const upload = multer({ dest: 'uploads/' });

const s3Client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: 'us-east-1',
  },
});

const uploadToS3Async = (localPath, s3Path) =>
  new Promise((resolve, reject) => {
    const params = {
      localFile: localPath,

      s3Params: {
        Bucket: 'webcatalog',
        Key: s3Path,
        // other options supported by putObject, except Body and ContentLength.
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
      },
    };

    const uploader = s3Client.uploadFile(params);
    uploader.on('error', (err) => {
      reject(err);
    });
    uploader.on('end', () => {
      resolve();
    });
  });

const sharpAsync = (pngPath, appId) =>
  new Promise((resolve, reject) => {
    // Generate WebP & PNG
    sharp(pngPath)
      .toFile(`uploads/${appId}.png`, (err) => {
        if (err) {
          console.log(`failed to generate uploads/${appId}.png`);
          reject(err);
        }
      })
      .toFile(`uploads/${appId}.webp`, (err) => {
        if (err) {
          console.log(`failed to generate uploads/${appId}.webp`);
          reject(err);
        }
      })
      .resize(128, 128)
      .toFile(`uploads/${appId}@128px.webp`, (err) => {
        if (err) {
          console.log(`failed to generate uploads/${appId}@128px.webp`);
          reject(err);
          return;
        }
        console.log(`${appId}.png is converted to other image formats.`);
        resolve();
      });
  });

admin.get('/', (req, res) => {
  res.redirect('/admin/apps');
});

admin.get('/apps', (req, res) => {
  res.json({});
});

admin.get('/apps/add', (req, res) => {
  res.render('admin/apps/add', { categories });
});

admin.post('/apps/add', upload.single('icon'), (req, res, next) => {
  if (!req.body || !req.file) res.sendStatus(400);
  else if (!req.body.name || !req.body.url || !req.body.category || !req.body.description) {
    res.send('Please fill in all fields.');
  } else {
    App.create({
      slug: slug(req.body.name, { lower: true }),
      name: req.body.name,
      url: req.body.url,
      category: req.body.category,
      isActive: false,
      version: Date.now().toString(),
      description: req.body.description,
    })
    .then(({ id }) =>
      sharpAsync(`${req.file.destination}${req.file.filename}`, id)
        .then(() => convertToIcns(`uploads/${id}.png`, `uploads/${id}.icns`))
        .then(() => convertToIco(`uploads/${id}.png`, `uploads/${id}.ico`))
        .then(() => uploadToS3Async(`uploads/${id}.png`, `${id}.png`))
        .then(() => uploadToS3Async(`uploads/${id}.webp`, `${id}.webp`))
        .then(() => uploadToS3Async(`uploads/${id}@128px.webp`, `${id}@128px.webp`))
        .then(() => uploadToS3Async(`uploads/${id}.icns`, `${id}.icns`))
        .then(() => uploadToS3Async(`uploads/${id}.ico`, `${id}.ico`))
        .then(() => App.find({ where: { id } }))
        .then(app => app.updateAttributes({
          isActive: true,
        })),
    )
    .then(() => {
      res.send('Done');
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      next(err);
    });
  }
});

module.exports = admin;
