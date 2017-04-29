import express from 'express';

import appApi from './appApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);

module.exports = apiRouter;
