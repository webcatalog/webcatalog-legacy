import express from 'express';
import passport from 'passport';
import errors from 'throw.js';
import { Client as IntercomClient } from 'intercom-client';

const feedbackApiRouter = express.Router();

const intercomClient = new IntercomClient({ token: process.env.INTERCOM_ACCESS_TOKEN });

feedbackApiRouter.post('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log(req.body);

  if (!req.body) return next(new errors.BadRequest());

  if (!req.body.content) {
    return next(new errors.BadRequest());
  }

  const message = {
    from: {
      type: 'user',
      user_id: req.user.id,
      email: req.user.email,
    },
    body: req.body.content,
  };

  // eslint-disable-next-line no-unused-vars
  return intercomClient.messages.create(message, (err, response) => {
    if (err) return next(err);

    return res.json({ success: true });
  });
});


module.exports = feedbackApiRouter;
