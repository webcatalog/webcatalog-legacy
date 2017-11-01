import express from 'express';
import errors from 'throw.js';

import App from '../models/App';
import categories from '../constants/categories';
import extractDomain from '../libs/extractDomain';
import generatePageList from '../libs/generatePageList';
import algoliaClient from '../algoliaClient';

const appsRouter = express.Router();

appsRouter.get(['/', '/category/:category'], (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const opts = {
    where: { isActive: true },
    offset,
    limit,
  };

  if (req.params.category && categories.indexOf(req.params.category) > -1) {
    opts.where.category = req.params.category;
  }

  switch (req.query.sort) {
    case 'createdAt': {
      opts.order = [['createdAt', 'DESC']];
      break;
    }
    case 'name': {
      opts.order = [['name', 'ASC'], ['createdAt', 'DESC']];
      break;
    }
    default: {
      opts.order = [['installCount', 'DESC'], ['createdAt', 'DESC']];
    }
  }

  App.findAndCountAll(opts)
    .then(({ rows, count }) => {
      const totalPage = Math.ceil(count / limit);

      if (currentPage > totalPage && currentPage > 1) throw new errors.NotFound();

      res.render('apps/index', {
        title: 'Apps',
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
      }))
    .catch(next);
});

appsRouter.get(['/details/:id', '/details/:slug/:id'], (req, res, next) => {
  App.find({ where: { id: req.params.id, isActive: true } })
    .then((app) => {
      if (!app) throw new errors.NotFound();

      let description = `${app.name} for Mac, Windows & Linux.`;
      if (app.description) description += ` ${app.description.split('. ')[0]}.`;

      const ua = req.headers['user-agent'];
      let platform = 'mobile';
      if (/(Intel|PPC) Mac OS X/.test(ua)) {
        platform = 'mac';
      } else if (/(Linux x86_64|Linux i686)/.test(ua)) {
        platform = 'linux';
      } else {
        platform = 'windows';
      }

      res.render('apps/app', {
        title: `${app.name} for Mac, Windows & Linux`,
        description,
        app,
        extractDomain,
        platform,
        version: process.env.VERSION,
      });
    })
    .catch(next);
});

module.exports = appsRouter;
