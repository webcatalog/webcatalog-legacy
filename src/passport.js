import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User from './models/User';

import generateHashAsync from './libs/generateHashAsync';

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      if (!user) return done(new Error('User not found'));
      return done(null, user);
    })
    .catch(err => done(err));
});

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
        defaults: {
          profilePicture: profile.photos[0].value,
          displayName: profile.displayName,
          googleId: profile.id,
        },
      })
      .spread((user) => {
        // try to update new profile picture
        if (
          user.profilePicture !== profile.photos[0].value ||
          user.displayName !== profile.displayName ||
          !user.googleId
        ) {
          user.updateAttributes({
            profilePicture: profile.photos[0].value,
            displayName: profile.displayName,
            googleId: profile.id,
          })
          .catch(console.log);
        }

        cb(null, user);
      })
      .catch(cb);
  },
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  (accessToken, refreshToken, profile, cb) => {
    User
      .findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          profilePicture: profile.photos[0].value,
          displayName: profile.displayName,
          facebookId: profile.id,
        },
      })
      .spread((user) => {
        // try to update new profile picture
        if (
          user.profilePicture !== profile.photos[0].value ||
          user.displayName !== profile.displayName ||
          !user.facebookId
        ) {
          user.updateAttributes({
            profilePicture: profile.photos[0].value,
            displayName: profile.displayName,
            facebookId: profile.id,
          })
          .catch(console.log);
        }

        cb(null, user);
      })
      .catch(cb);
  },
));

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  },
  (accessToken, refreshToken, profile, cb) => {
    User
      .findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          profilePicture: profile.photos[0].value,
          displayName: profile.displayName,
          twitterId: profile.id,
        },
      })
      .spread((user) => {
        // try to update new profile picture
        if (
          user.profilePicture !== profile.photos[0].value ||
          user.displayName !== profile.displayName ||
          !user.twitterId
        ) {
          user.updateAttributes({
            profilePicture: profile.photos[0].value,
            displayName: profile.displayName,
            twitterId: profile.id,
          })
          .catch(console.log);
        }

        cb(null, user);
      })
      .catch(cb);
  },
));

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      })
      .catch(done);
  },
));


const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
};

passport.use(new JwtStrategy(jwtOpts, (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false));
}));

module.exports = passport;
