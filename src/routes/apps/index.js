import express from 'express';

import App from '../../models/App';
import categories from '../../constants/categories';
import extractDomain from '../../libs/extractDomain';

const appsRouter = express.Router();

appsRouter.get('/', (req, res) => {
  const opts = { where: { isActive: true } };

  if (req.query.category && categories.indexOf(req.query.category) > -1) {
    opts.where.category = req.query.category;
  }

  App.findAll(opts)
    .then((apps) => {
      res.render('apps/index', { title: 'Explore WebCatalog Store', apps, categories, category: opts.where.category });
    });
});

appsRouter.get(['/id:id', '/:slug/id:id'], (req, res, next) => {
  const id = req.params.id;
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
    App.find({ where: { id, isActive: true } })
      .then((app) => {
        if (!app) next(new Error('App does not exist or is not activated.'));
        res.render('apps/app', { title: `${app.name} for Mac and PC on the WebCatalog Store`, app, extractDomain });
      });
  } else {
    next(new Error('UUID is not valid.'));
  }
});

module.exports = appsRouter;
