import express from 'express';
import errors from 'throw.js';
import { Client as IntercomClient } from 'intercom-client';

import ensureLoggedIn from '../../middlewares/ensureLoggedIn';

const submitRouter = express.Router();

const intercomClient = new IntercomClient({ token: process.env.INTERCOM_ACCESS_TOKEN });

submitRouter.get('/', ensureLoggedIn, (req, res) => {
  res.render('submit/index', { title: 'Submit New App' });
});

submitRouter.post('/', ensureLoggedIn, (req, res, next) => {
  if (!req.body) return next(new errors.BadRequest('Request is not valid.'));

  if (!req.body.name || !req.body.url) {
    return next(new errors.BadRequest('Request is not valid.'));
  }

  const message = {
    from: {
      type: 'user',
      user_id: req.user.id,
      email: req.user.email,
    },
    body: `App Submission (${new Date()}):
    Name: ${req.body.name}
    URL: ${req.body.url}
    `,
  };

  // eslint-disable-next-line no-unused-vars
  return intercomClient.messages.create(message, (err, response) => {
    if (err) return next(err);
    return res.render('submit/success', { title: 'Submit New App' });
  });
});

module.exports = submitRouter;
