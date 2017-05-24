import express from 'express';
import passport from 'passport';
import sequelize from 'sequelize';

import App from '../../models/App';
import Action from '../../models/Action';

const meApiRouter = express.Router();

meApiRouter.get('/apps', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  const currentPage = parseInt(req.query.page, 10) || 1;
  const limit = 24;
  const offset = (currentPage - 1) * limit;

  Action.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('appId')), 'appId'], 'createdAt'],
    where: { userId: req.user.id },
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  })
  .then((actions) => {
    const opts = {
      attributes: ['id', 'slug', 'name', 'url', 'version'],
      where: {
        isActive: true,
        id: {
          $in: actions.map(action => action.appId),
        },
      },
    };

    return App.findAndCountAll(opts)
      .then(({ rows, count }) => {
        const totalPage = Math.ceil(count / limit);

        if (currentPage > totalPage && currentPage > 1) throw new Error('404');

        return res.json({
          apps: rows,
          totalPage,
        });
      })
      .catch(next);
  })
  .catch(next);
});

module.exports = meApiRouter;
