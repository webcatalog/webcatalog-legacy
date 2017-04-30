import express from 'express';

import App from '../../models/App';
import categories from '../../constants/categories';
import extractDomain from '../../libs/extractDomain';

const appsRouter = express.Router();

appsRouter.get('/', (req, res, next) => {
  const opts = { where: { isActive: true } };

  if (req.query.category && categories.indexOf(req.query.category) > -1) {
    opts.where.category = req.query.category;
  }

  App.findAll(opts)
    .then((apps) => {
      res.render('apps/index', { title: 'Explore WebCatalog Store', apps, categories, category: opts.where.category });
    })
    .catch(next);
});

appsRouter.get(['/id:id', '/:slug/id:id'], (req, res, next) => {
  App.find({ where: { id: req.params.id, isActive: true } })
    .then((app) => {
      if (!app) throw new Error('App does not exist or is not activated.');

      let description = `${app.name} for Mac, Windows & Linux on the WebCatalog Store.`;
      if (app.description) description += ` ${app.description.split('. ')[0]}.`;

      res.render('apps/app', {
        title: `${app.name} for Mac, Windows & Linux on the WebCatalog Store`,
        description,
        app,
        extractDomain,
      });
    })
    .catch(next);
});

module.exports = appsRouter;
