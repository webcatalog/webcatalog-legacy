import express from 'express';

import appApi from './appApiRouter';
import authApi from './authApiRouter';
import draftApi from './draftApiRouter';
import userApi from './userApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/user', userApi);
apiRouter.use('/drafts', draftApi);
apiRouter.use('/auth', authApi);

module.exports = apiRouter;
