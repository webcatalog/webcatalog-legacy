import express from 'express';
import passport from 'passport';
import multer from 'multer';
import s3 from 's3';
import sharp from 'sharp';
import slug from 'slug';
import fetch from 'node-fetch';
import errors from 'throw.js';

import convertToIcns from '../../libs/convertToIcns';
import convertToIco from '../../libs/convertToIco';
import algoliaClient from '../../algoliaClient';
import App from '../../models/App';
import Action from '../../models/Action';
import categories from '../../constants/categories';

const appApiRouter = express.Router();

const unretrievableAttributes = ['installCount', 'isActive', 'updatedAt', 'createdAt'];

appApiRouter.get('/', (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 24;
  const offset = (currentPage - 1) * limit;

  if (limit > 50) {
    return next(new errors.BadRequest('bad_request', 'Maximum limit: 50'));
  }

  const opts = {
    attributes: ['id', 'slug', 'name', 'url', 'version'],
    where: { isActive: true },
  };

  if (req.query.ids) {
    opts.where.id = {
      $in: req.query.ids.split(','),
    };
  } else {
    opts.offset = offset;
    opts.limit = limit;

    if (req.query.category && categories.indexOf(req.query.category) > -1) {
      opts.where.category = req.query.category;
    }
  }

  switch (req.query.sort) {
    case 'createdAt': {
      // default DESC
      const direction = req.query.order === 'asc' ? 'ASC' : 'DESC';

      opts.order = [['createdAt', direction]];
      break;
    }
    case 'name': {
      // default ASC
      const direction = req.query.order === 'desc' ? 'DESC' : 'ASC';

      opts.order = [['name', direction], ['createdAt', 'DESC']];
      break;
    }
    default: {
      // default DESC
      const direction = req.query.order === 'asc' ? 'ASC' : 'DESC';

      opts.order = [['installCount', direction], ['createdAt', 'DESC']];
    }
  }

  return App.findAndCountAll(opts)
    .then(({ rows, count }) => {
      const totalPage = Math.ceil(count / limit);

      if (currentPage > totalPage && currentPage > 1) throw new errors.NotFound();

      return res.json({
        apps: rows,
        totalPage,
      });
    })
    .catch(next);
});

appApiRouter.get('/:id', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      next(err);
    } else {
      App.find({
        attributes: { exclude: unretrievableAttributes },
        where: { id: req.params.id, isActive: true },
      })
      .then((app) => {
        if (!app) throw new errors.NotFound();

        if (user && (req.query.action === 'install' || req.query.action === 'update')) {
          return Action.findOne({ where: { appId: app.id, userId: user.id } })
            .then((action) => {
              if (!action) {
                return app.increment('installCount');
              }
              return null;
            })
            .then(() => Action.create({ actionName: req.query.action }))
            .then(action =>
              Promise.all([
                action.setApp(app),
                action.setUser(user),
              ]),
            )
            .then(() => res.json({ app }));
        }

        return res.json({ app });
      })
      .catch(next);
    }
  })(req, res, next);
});

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

appApiRouter.patch('/:id', passport.authenticate('jwt', { session: false }), upload.single('icon'), (req, res, next) => {
  if (!req.body) {
    return next(new errors.BadRequest('bad_request'));
  }

  return App.findById(req.params.id)
    .then((app) => {
      if (!app.userId && !req.user.isAdmin) {
        return Promise.reject(new errors.CustomError('admin_only', 'Admin permission is required.'));
      }

      if (app.userId && app.userId !== req.user.id) {
        return Promise.reject(new errors.BadRequest('bad_request'));
      }

      return Promise.resolve()
        .then(() => {
          if (!req.file) return null;

          return compileUploadImagesAsync(req.file.filename, app.id);
        })
        .then(() => fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(req.body.wikipediaTitle || req.body.name || app.wikipediaTitle || app.name)}`))
        .then(response => response.json())
        .then((content) => {
          const pageId = Object.keys(content.query.pages);
          if (pageId === '-1') return null;

          return content.query.pages[pageId].extract;
        })
        .then((description) => {
          const newAttributes = {};
          if (req.body.name) {
            newAttributes.slug = slug(req.body.name, { lower: true });
            newAttributes.name = req.body.name;
          }
          if (req.body.url) newAttributes.url = req.body.url;
          if (req.body.category) newAttributes.category = req.body.category;
          if (req.body.wikipediaTitle) newAttributes.wikipediaTitle = req.body.wikipediaTitle;

          return app.updateAttributes(Object.assign({}, newAttributes, {
            description,
            isActive: true,
            version: Date.now().toString(),
          }));
        })
        .then(() => {
          const plainApp = app.get({ plain: true });
          plainApp.objectID = plainApp.id;

          const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
          return index.addObject(plainApp)
            .then(() => App.find({
              attributes: { exclude: unretrievableAttributes },
              where: { id: app.id },
            }))
            .then(updatedApp => res.json({ app: updatedApp }));
        });
    })
    .catch(next);
});

appApiRouter.post('/', passport.authenticate('jwt', { session: false }), upload.single('icon'), (req, res, next) => {
  if (!req.body || !req.file || !req.body.name || !req.body.url || !req.body.category) {
    return next(new errors.BadRequest('bad_request'));
  }

  const wikipediaTitle = req.body.wikipediaTitle || req.body.name;

  if (req.body.public && !req.user.isAdmin) {
    return next(new errors.CustomError('admin_only', 'Admin permission is required.'));
  }

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
        userId: req.body.public ? null : req.user.id,
      }),
    )
    .then(app =>
      compileUploadImagesAsync(req.file.filename, app.id)
        .then(() => app.updateAttributes({
          isActive: true,
        })),
    )
    .then((app) => {
      const plainApp = app.get({ plain: true });
      plainApp.objectID = plainApp.id;

      const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
      return index.addObject(plainApp)
        .then(() => App.find({
          attributes: { exclude: unretrievableAttributes },
          where: { id: app.id },
        }))
        .then(addedApp => res.json({ app: addedApp }));
    })
    .catch(next);
});

module.exports = appApiRouter;
