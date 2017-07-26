import express from 'express';

import appApi from './appApiRouter';
import authApi from './authApiRouter';
import draftApi from './draftApiRouter';
import feedbackApi from './feedbackApiRouter';
import userApi from './userApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/auth', authApi);
apiRouter.use('/drafts', draftApi);
apiRouter.use('/feedback', feedbackApi);
apiRouter.use('/user', userApi);

module.exports = apiRouter;
