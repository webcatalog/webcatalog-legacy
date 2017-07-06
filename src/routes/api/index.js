import express from 'express';

import appApi from './appApiRouter';
import draftApi from './draftApiRouter';
import userApi from './userApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/user', userApi);
apiRouter.use('/drafts', draftApi);

module.exports = apiRouter;
