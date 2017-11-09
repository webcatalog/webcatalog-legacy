import express from 'express';
import multer from 'multer';
import s3 from 's3';
import sharp from 'sharp';
import slug from 'slug';
import fetch from 'node-fetch';
import errors from 'throw.js';
import moment from 'moment';

import App from '../models/App';
import Draft from '../models/Draft';
import User from '../models/User';
import categories from '../constants/categories';
import convertToIcns from '../libs/convertToIcns';
import convertToIco from '../libs/convertToIco';
import algoliaClient from '../algoliaClient';
import mailTransporter from '../mailTransporter';

const adminRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

const s3Client = s3.createClient({
  maxAsyncS3: 20, // this is the default
  s3RetryCount: 3, // this is the default
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

const compileUploadImagesAsync = (fileName, appId) =>
  Promise.resolve()
    .then(() => {
      const p = [];
      p.push(sharpAsync(`uploads/${fileName}`, `uploads/${appId}.png`));
      p.push(sharpAsync(`uploads/${fileName}`, `uploads/${appId}.webp`));
      p.push(sharpAsync(`uploads/${fileName}`, `uploads/${appId}@128px.png`, 128));
      p.push(sharpAsync(`uploads/${fileName}`, `uploads/${appId}@128px.webp`, 128));

      return Promise.all(p);
    })
    .then(() => {
      const p = [];
      p.push(convertToIcns(`uploads/${appId}.png`, `uploads/${appId}.icns`));
      p.push(convertToIco(`uploads/${appId}.png`, `uploads/${appId}.ico`));

      return Promise.all(p);
    })
    .then(() => {
      const p = [];
      p.push(uploadToS3Async(`uploads/${appId}.png`, `${appId}.png`));
      p.push(uploadToS3Async(`uploads/${appId}.webp`, `${appId}.webp`));
      p.push(uploadToS3Async(`uploads/${appId}@128px.png`, `${appId}@128px.png`));
      p.push(uploadToS3Async(`uploads/${appId}@128px.webp`, `${appId}@128px.webp`));
      p.push(uploadToS3Async(`uploads/${appId}.icns`, `${appId}.icns`));
      p.push(uploadToS3Async(`uploads/${appId}.ico`, `${appId}.ico`));

      return Promise.all(p);
    });

adminRouter.get('/', (req, res, next) => {
  const opts = {
    where: { status: null },
    order: [['createdAt', 'DESC']],
    include: [User],
  };

  return Draft.findAndCountAll(opts)
    .then(({ rows, count }) => {
      res.render('admin/index', {
        title: 'AdminCP',
        drafts: rows.map(row => Object.assign({}, row.get({ plain: true }), {
          createdAt: moment(row.createdAt).fromNow(),
        })),
        draftCount: count,
      });
    })
    .catch(next);
});

adminRouter.get('/update-algolia-data', (req, res, next) => {
  const opts = {
    attributes: ['id', 'installCount'],
    where: { isActive: true },
    raw: true,
  };

  return App.findAll(opts)
    .then((apps) => {
      const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
      return index.partialUpdateObjects(apps.map(app => ({
        objectID: app.id,
        installCount: app.installCount,
      })));
    })
    .then(() => res.redirect('/admin'))
    .catch(next);
});

adminRouter.get('/drafts/set-status', (req, res, next) => {
  if (!req.query || !req.query.id || !req.query.status) {
    return next(new errors.BadRequest());
  }

  const { id, status } = req.query;

  if (['rejected', 'added', 'already_added', 'neutral'].indexOf(status) < 0) {
    return next(new errors.BadRequest());
  }

  return Draft.findOne({ where: { id }, include: [User] })
    .then((draft) => {
      let subject;
      let text;
      switch (status) {
        case 'rejected': {
          subject = `${draft.name} has been rejected by Webcatalog`;
          text = `Hi,
Thank you very much for submitting ${draft.name} (${draft.url}) to WebCatalog. We've reviewed the application and, consistent with criteria considered in our approval process, we have chosen not to publish it. We're really sorry.
If you have any questions, please reply directly to this email.

Best regards,
WebCatalog Team`;
          break;
        }
        case 'added': {
          subject = `${draft.name} has been approved by Webcatalog`;
          text = `Hi,
Thank you very much for submitting ${draft.name} (${draft.url}) to WebCatalog. We've reviewed the application and the app is now available on WebCatalog. You can now search for and install the app.
If you have any questions, please reply directly to this email.

Best regards,
WebCatalog Team`;
          break;
        }
        case 'already_added': {
          subject = `${draft.name} has been approved by Webcatalog`;
          text = `Hi,
Thank you very much for submitting ${draft.name} (${draft.url}) to WebCatalog. The app you submitted is already available on WebCatalog. You can search for and install the app.
If you have any questions, please reply directly to this email.

Best regards,
WebCatalog Team`;
          break;
        }
        default: break;
      }

      mailTransporter.sendMail({
        from: {
          name: 'WebCatalog Team',
          address: 'support@webcatalog.io',
        },
        to: draft.user.email,
        subject,
        text,
      });

      return draft.updateAttributes({ status });
    })
    .then(() => res.redirect('/admin'))
    .catch(next);
});

adminRouter.get('/apps/add', (req, res, next) => {
  if (req.query.draftId) {
    return Draft.findById(req.query.draftId)
      .then((draft) => {
        const { name, url } = draft;
        return res.render('admin/add', {
          title: 'Add New App', categories, name, url,
        });
      })
      .catch(next);
  }

  return res.render('admin/add', { title: 'Add New App', categories });
});

adminRouter.get('/edit/id:id', (req, res, next) => {
  App.findById(req.params.id)
    .then(app => res.render('admin/edit', { title: `Edit ${app.name}`, categories, app }))
    .catch(next);
});

adminRouter.post('/edit/id:id', upload.single('icon'), (req, res, next) => {
  if (!req.body) return next(new errors.BadRequest());

  if (!req.body.name || !req.body.url || !req.body.category) {
    return res.send('Please fill in all fields.');
  }

  return App.findById(req.params.id)
    .then(app =>
      Promise.resolve()
        .then(() => {
          if (!req.file) return null;

          return compileUploadImagesAsync(req.file.filename, app.id);
        })
        .then(() => fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(req.body.wikipediaTitle || req.body.name)}`))
        .then(response => response.json())
        .then((content) => {
          const pageId = Object.keys(content.query.pages);
          if (pageId === '-1') return null;

          return content.query.pages[pageId].extract;
        })
        .then(description =>
          app.updateAttributes({
            slug: slug(req.body.name, { lower: true }),
            name: req.body.name,
            url: req.body.url,
            category: req.body.category,
            isActive: true,
            version: Date.now().toString(),
            description,
            wikipediaTitle: req.body.wikipediaTitle,
          }))
        .then(() => {
          const plainApp = app.get({ plain: true });
          plainApp.objectID = plainApp.id;

          const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
          return index.addObject(plainApp)
            .then(() => {
              res.redirect(`/apps/details/${app.slug}/${app.id}`);
            });
        }))
    .catch(next);
});

adminRouter.post('/apps/add', upload.single('icon'), (req, res, next) => {
  if (!req.body || !req.file) return next(new errors.BadRequest());

  if (!req.body.name || !req.body.url || !req.body.category) {
    return res.send('Please fill in all fields.');
  }

  const wikipediaTitle = req.body.wikipediaTitle || req.body.name;

  return fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(wikipediaTitle)}`)
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
      }))
    .then(app =>
      compileUploadImagesAsync(req.file.filename, app.id)
        .then(() => app.updateAttributes({
          isActive: true,
        })))
    .then((app) => {
      const plainApp = app.get({ plain: true });
      plainApp.objectID = plainApp.id;

      const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
      return index.addObject(plainApp)
        .then(() => {
          if (req.query.draftId) {
            return res.redirect(`/admin/drafts/set-status?id=${req.query.draftId}&status=added`);
          }
          return res.redirect('/admin');
        });
    })
    .catch(next);
});

module.exports = adminRouter;
