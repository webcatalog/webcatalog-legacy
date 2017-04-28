import express from 'express';

import App from '../../models/App';

const appApi = express.Router();

appApi.get('/', (req, res, next) => {
  App.findAll({ where: { isActive: true } })
    .then((apps) => {
      res.json(apps);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = appApi;
