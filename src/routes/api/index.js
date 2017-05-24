import express from 'express';
import passport from 'passport';
import crypto from 'crypto';

import appApi from './appApiRouter';
import meApi from './meApiRouter';

const apiRouter = express.Router();

apiRouter.use('/apps', appApi);
apiRouter.use('/me', meApi);

apiRouter.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
  hmac.update(req.user.id);

  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      displayName: req.user.displayName,
      profilePicture: req.user.profilePicture,
      intercomUserHash: hmac.digest('hex'),
    },
  });
});

module.exports = apiRouter;
