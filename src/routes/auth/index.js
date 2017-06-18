import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../../models/User';
import isEmail from '../../libs/isEmail';

const authRouter = express.Router();

const beforeAuthMiddleware = (req, res, next) => {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }

  if (req.query.jwt === '1') {
    req.session.useJWT = true;
  }

  next();
};

const afterAuthMiddleware = (req, res) => {
  if (req.session.useJWT) {
    const payload = { id: req.user.id };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
      },
    );
    req.session.useJWT = null;
    req.logout();
    return res.render('jwt', { token });
  }

  const returnTo = req.session.returnTo || '/';
  req.session.returnTo = null;

  return res.redirect(returnTo);
};

authRouter.get('/', beforeAuthMiddleware, (req, res) => {
  res.render('auth/index', { title: 'Sign in to WebCatalog' });
});

authRouter.post('/',
  beforeAuthMiddleware,
  (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        if (err.message === 'NO_PASSWORD') {
          return res.render('auth/index', {
            title: 'Sign in to WebCatalog',
            email: req.body.email,
            loginErr: 'You haven\'t set up a WebCatalog password yet.',
          });
        }
        return next(err);
      }

      if (!user) {
        return res.render('auth/index', {
          title: 'Sign in to WebCatalog',
          email: req.body.email,
          loginErr: 'The email or password you entered is incorrect.',
        });
      }

      return req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return next();
      });
    })(req, res, next);
  },
  afterAuthMiddleware);

authRouter.get('/sign-up', beforeAuthMiddleware, (req, res) => {
  res.render('auth/sign-up', { title: 'Join WebCatalog' });
});

authRouter.post('/sign-up', beforeAuthMiddleware, (req, res, next) => {
  if (!req.body) return next(new Error('Request is not valid.'));

  if (!req.body.email || !req.body.password || !isEmail(req.body.email)) {
    return next(new Error('Request is not valid.'));
  }

  if (req.body.password.length < 6) {
    return next(new Error('Password must have at least 6 characters.'));
  }

  return User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (user) {
        return res.render('auth/sign-up', {
          title: 'Join WebCatalog',
          email: req.body.email,
          emailError: 'The email is already taken.',
        });
      }

      return bcrypt.hash(req.body.password, 10)
        .then(hash =>
          User.create({
            email: req.body.email,
            password: hash,
            verified: false,
          }),
        )
        .then(createdUser => new Promise((resolve, reject) => {
          req.logIn(createdUser, (loginErr) => {
            if (loginErr) {
              reject(loginErr);
              return;
            }
            resolve();
          });
        }))
        .then(() => next());
    })
    .catch(next);
}, afterAuthMiddleware);

authRouter.get('/google',
  beforeAuthMiddleware,
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  afterAuthMiddleware);

authRouter.get('/facebook',
  beforeAuthMiddleware,
  passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
  afterAuthMiddleware);

authRouter.get('/twitter',
  beforeAuthMiddleware,
  passport.authenticate('twitter'));

authRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth/twitter' }),
  afterAuthMiddleware);


authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;
