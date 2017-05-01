import express from 'express';

import App from '../../models/App';
import categories from '../../constants/categories';
import extractDomain from '../../libs/extractDomain';
import generatePageList from '../../libs/generatePageList';
import algoliaClient from '../../algoliaClient';

const appsRouter = express.Router();

appsRouter.get('/', (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const opts = {
    where: { isActive: true },
    offset,
    limit,
  };

  if (req.query.category && categories.indexOf(req.query.category) > -1) {
    opts.where.category = req.query.category;
  }

  switch (req.query.sort) {
    case 'createdAt': {
      opts.order = [['createdAt', 'DESC']];
      break;
    }
    case 'name': {
      opts.order = [['name', 'ASC']];
      break;
    }
    default: {
      opts.order = [['installCount', 'DESC']];
    }
  }

  App.findAndCountAll(opts)
    .then(({ rows, count }) => {
      const totalPage = Math.ceil(count / limit);

      if (currentPage > totalPage && currentPage > 1) throw new Error('404');

      let path = '/apps';
      if (opts.where.category) path += `?category=${opts.where.category}`;

      res.render('apps/index', {
        path,
        title: 'Explore WebCatalog Store',
        apps: rows,
        categories,
        category: opts.where.category,
        currentPage,
        pages: generatePageList(currentPage, totalPage),
        totalPage,
        sort: opts.order ? req.query.sort : null,
      });
    })
    .catch(next);
});

appsRouter.get('/search', (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;

  if (!req.query.query) {
    return res.render('apps/search', {
      title: 'Search',
      apps: null,
      searchQuery: req.query.query,
    });
  }

  const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);
  return index.search(req.query.query, { page: currentPage - 1, hitsPerPage: limit })
    .then(({ hits, nbPages }) =>
      res.render('apps/search', {
        title: `Search Results for "${req.query.query}"`,
        apps: hits,
        currentPage,
        pages: generatePageList(currentPage, nbPages),
        totalPage: nbPages,
        searchQuery: req.query.query,
      }),
    )
    .catch(next);
});

appsRouter.get(['/id:id', '/:slug/id:id'], (req, res, next) => {
  App.find({ where: { id: req.params.id, isActive: true } })
    .then((app) => {
      if (!app) throw new Error('404');

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
