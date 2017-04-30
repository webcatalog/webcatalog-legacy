import express from 'express';

import App from '../../models/App';
import categories from '../../constants/categories';
import extractDomain from '../../libs/extractDomain';
import generatePageList from '../../libs/generatePageList';

const appsRouter = express.Router();

appsRouter.get('/', (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const opts = {
    where: { isActive: true },
    offset,
    limit,
  };

  if (req.query.category && categories.indexOf(req.query.category) > -1) {
    opts.where.category = req.query.category;
  }

  App.findAndCountAll(opts)
    .then(({ rows, count }) => {
      const totalPage = Math.ceil(count / limit);

      res.render('apps/index', {
        title: 'Explore WebCatalog Store',
        apps: rows,
        categories,
        category: opts.where.category,
        currentPage,
        pages: generatePageList(currentPage, totalPage),
        totalPage,
      });
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
