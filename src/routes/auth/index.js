import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../../models/User';

const authRouter = express.Router();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, cb) => {
    User
      .findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { profilePicture: profile.photos[0].value },
      })
      .spread((user) => {
        // try to update new profile picture
        if (user.profilePicture !== profile.photos[0].value) {
          user.updateAttributes({
            profilePicture: profile.photos[0].value,
          })
          .catch(console.log);
        }

        cb(null, user);
      })
      .catch(err => cb(err));
  },
));

authRouter.get(['/', '/google'],
  (req, res, next) => {
    if (req.query.returnTo) {
      req.session.returnTo = req.query.returnTo;
    }
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
    req.session.returnTo = null;
  });

authRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = authRouter;
