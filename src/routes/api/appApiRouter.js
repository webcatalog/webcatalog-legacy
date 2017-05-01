import express from 'express';
import passport from 'passport';

import App from '../../models/App';
import categories from '../../constants/categories';

const appApiRouter = express.Router();

const unretrievableAttributes = ['installCount', 'isActive', 'updatedAt', 'createdAt', 'wikipediaTitle'];

appApiRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  const opts = {
    attributes: { exclude: unretrievableAttributes },
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

      return res.json({
        apps: rows,
        totalPage,
      });
    })
    .catch(next);
});

appApiRouter.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  App.find({
    attributes: { exclude: unretrievableAttributes },
    where: { id: req.params.id, isActive: true },
  })
    .then((app) => {
      if (!app) throw new Error('404');
      return res.json({ app });
    })
    .catch(next);
});

module.exports = appApiRouter;
