import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

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
    return res.render('jwt', { token });
  }

  const returnTo = req.session.returnTo || '/';
  req.session.returnTo = null;
  return res.redirect(returnTo);
};

authRouter.get('/', beforeAuthMiddleware, (req, res) => {
  res.render('auth/index', { title: 'Sign in to WebCatalog' });
});

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
