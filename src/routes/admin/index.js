import express from 'express';
import multer from 'multer';
import s3 from 's3';
import sharp from 'sharp';
import slug from 'slug';
import fetch from 'node-fetch';

import App from '../../models/App';
import categories from '../../constants/categories';
import convertToIcns from '../../libs/convertToIcns';
import convertToIco from '../../libs/convertToIco';
import algoliaClient from '../../algoliaClient';

const adminRouter = express.Router();

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
        Bucket: process.env.S3_BUCKET,
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

const sharpAsync = (inputPath, outputPath, newSize) =>
  new Promise((resolve, reject) => {
    // Generate WebP & PNG
    let p = sharp(inputPath);
    if (newSize) {
      p = p.resize(newSize, newSize);
    }

    p = p.toFile(outputPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

    return p;
  });

adminRouter.get('/', (req, res) => {
  res.redirect('/admin/add');
});

adminRouter.get('/add', (req, res) => {
  res.render('admin/add', { title: 'Add New App', categories });
});

adminRouter.post('/apps/add', upload.single('icon'), (req, res, next) => {
  if (!req.body || !req.file) res.sendStatus(400);
  else if (!req.body.name || !req.body.url || !req.body.category) {
    res.send('Please fill in all fields.');
  } else {
    const wikipediaTitle = req.body.wikipediaTitle || req.body.name;

    fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(wikipediaTitle)}`)
    .then(response => response.json())
    .then((content) => {
      const pageId = Object.keys(content.query.pages);
      if (pageId === '-1') return null;

      return content.query.pages[pageId].extract;
    })
    .then(description =>
      App.create({
        slug: slug(req.body.name, { lower: true }),
        name: req.body.name,
        url: req.body.url,
        category: req.body.category,
        isActive: false,
        version: Date.now().toString(),
        description,
        wikipediaTitle: req.body.wikipediaTitle,
      }),
    )
    .then(app =>
      Promise.resolve()
        .then(() => {
          const p = [];
          p.push(sharpAsync(`uploads/${req.file.filename}`, `uploads/${app.id}.png`));
          p.push(sharpAsync(`uploads/${req.file.filename}`, `uploads/${app.id}.webp`));
          p.push(sharpAsync(`uploads/${req.file.filename}`, `uploads/${app.id}@128px.png`, 128));
          p.push(sharpAsync(`uploads/${req.file.filename}`, `uploads/${app.id}@128px.webp`, 128));

          return Promise.all(p);
        })
        .then(() => {
          const p = [];
          p.push(convertToIcns(`uploads/${app.id}.png`, `uploads/${app.id}.icns`));
          p.push(convertToIco(`uploads/${app.id}.png`, `uploads/${app.id}.ico`));

          return Promise.all(p);
        })
        .then(() => {
          const p = [];
          p.push(uploadToS3Async(`uploads/${app.id}.png`, `${app.id}.png`));
          p.push(uploadToS3Async(`uploads/${app.id}.webp`, `${app.id}.webp`));
          p.push(uploadToS3Async(`uploads/${app.id}@128px.png`, `${app.id}@128px.png`));
          p.push(uploadToS3Async(`uploads/${app.id}@128px.webp`, `${app.id}@128px.webp`));
          p.push(uploadToS3Async(`uploads/${app.id}.icns`, `${app.id}.icns`));
          p.push(uploadToS3Async(`uploads/${app.id}.ico`, `${app.id}.ico`));

          return Promise.all(p);
        })
        .then(() => app.updateAttributes({
          isActive: true,
        })),
    )
    .then((app) => {
      const plainApp = app.get({ plain: true });
      plainApp.objectID = plainApp.id;

      const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
      return index.addObject(plainApp)
        .then(() => {
          res.redirect(`/apps/${app.slug}/id${app.id}`);
        });
    })
    .catch((err) => {
      next(err);
    });
  }
});

module.exports = adminRouter;
