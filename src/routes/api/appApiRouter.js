import express from 'express';
import passport from 'passport';

import User from '../../models/User';
import App from '../../models/App';
import Action from '../../models/Action';

import categories from '../../constants/categories';

const appApiRouter = express.Router();

const unretrievableAttributes = ['installCount', 'isActive', 'updatedAt', 'createdAt'];

appApiRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

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

      if (req.query.action === 'install' || req.query.action === 'update') {
        return User.findById(req.user.id)
          .then((user) => {
            if (!user) throw new Error('Cannot find user');

            return Action.findOne({ where: { appId: app.id } })
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
              );
          })
          .then(() => res.json({ app }));
      }

      return res.json({ app });
    })
    .catch(next);
});

module.exports = appApiRouter;
