import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.get(['/', '/google'],
  (req, res, next) => {
    if (req.query.returnTo) {
      req.session.returnTo = req.query.returnTo;
    }

    if (req.query.jwt === '1') {
      req.session.useJWT = true;
    }

    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
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
      return res.json({ token });
    }

    const returnTo = req.session.returnTo || '/';
    req.session.returnTo = null;
    return res.redirect(returnTo);
  });

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;
