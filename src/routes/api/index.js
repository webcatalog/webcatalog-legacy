import express from 'express';

import appApi from './appApiRouter';
import userApi from './userApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/user', userApi);

module.exports = apiRouter;
