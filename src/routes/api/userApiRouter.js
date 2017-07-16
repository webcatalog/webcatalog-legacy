import express from 'express';
import passport from 'passport';
import sequelize from 'sequelize';
import crypto from 'crypto';
import errors from 'throw.js';

import App from '../../models/App';
import Action from '../../models/Action';

const userApiRouter = express.Router();

userApiRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
  hmac.update(req.user.id);

  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      profilePicture: req.user.profilePicture,
      intercomUserHash: hmac.digest('hex'),
    },
  });
});

userApiRouter.get('/apps', passport.authenticate('jwt', { session: false }), (req, res, next) => {
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

        if (currentPage > totalPage && currentPage > 1) throw new errors.NotFound();

        return res.json({
          apps: rows,
          totalPage,
        });
      })
      .catch(next);
  })
  .catch(next);
});

module.exports = userApiRouter;
