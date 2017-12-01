import express from 'express';

import version from './version';

const apiRouter = express.Router();

apiRouter.use('/version', version);

export default apiRouter;
