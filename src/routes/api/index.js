import express from 'express';

import appApi from './appApiRouter';
import authApi from './authApiRouter';
import draftApi from './draftApiRouter';
import feedbackApi from './feedbackApiRouter';
import userApi from './userApiRouter';
import versionApi from './versionApiRouter';
import searchApi from './searchApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/auth', authApi);
apiRouter.use('/drafts', draftApi);
apiRouter.use('/feedback', feedbackApi);
apiRouter.use('/user', userApi);
apiRouter.use('/version', versionApi);
apiRouter.use('/search', searchApi);

module.exports = apiRouter;
