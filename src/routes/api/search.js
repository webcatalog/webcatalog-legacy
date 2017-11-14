import express from 'express';
import errors from 'throw.js';

import algoliaClient from '../../algolia-client';

const appApiRouter = express.Router();

const index = algoliaClient.initIndex(process.env.ALGOLIASEARCH_INDEX_NAME);

appApiRouter.get('/apps', (req, res, next) => {
  if (!req.query || !req.query.q) {
    return next(new errors.BadRequest());
  }

  const { q } = req.query;
  const page = req.query.page || 0;
  const hitsPerPage = req.query.hitsPerPage || 48;

  return index.search(q, { hitsPerPage, page })
    .then(result => res.json(result))
    .catch(next);
});

export default appApiRouter;
