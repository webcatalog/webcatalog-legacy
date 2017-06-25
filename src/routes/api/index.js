import express from 'express';

import appApi from './appApiRouter';
import submitApi from './submitApiRouter';
import userApi from './userApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/user', userApi);
apiRouter.use('/submit', submitApi);

module.exports = apiRouter;
