import express from 'express';
import errors from 'throw.js';

import algoliaClient from '../../algoliaClient';

const appApiRouter = express.Router();

const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);

appApiRouter.get('/apps', (req, res, next) => {
  if (!req.query || !req.query.q) {
    return next(new errors.BadRequest());
  }

  const q = req.query.q;

  return index.search(q, { hitsPerPage: 48 })
    .then(result => res.json(result))
    .catch(next);
});

module.exports = appApiRouter;
