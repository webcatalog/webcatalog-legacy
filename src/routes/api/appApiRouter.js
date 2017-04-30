import express from 'express';
import passport from 'passport';

import App from '../../models/App';

const appApiRouter = express.Router();

appApiRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  App.findAll({ where: { isActive: true } })
    .then(apps => res.json(apps))
    .catch(next);
});

appApiRouter.get('/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  App.find({ where: { id: req.params.id, isActive: true } })
    .then((app) => {
      if (!app) throw new Error('App not found');
      return res.json(app);
    })
    .catch(next);
});

module.exports = appApiRouter;
