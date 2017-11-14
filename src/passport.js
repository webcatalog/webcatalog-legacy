import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import errors from 'throw.js';

import User from './models/user';

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      if (!user) return done(new errors.CustomError('UserNotFound', 'User not found'));
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

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, cb) => {
    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) { return cb(null, false); }

        if (!user.password || user.password.length < 1) return cb(new errors.CustomError('NoPassword', 'User doesn\'t have password.'), false);

        return bcrypt.compare(password, user.password).then((isValid) => {
          if (isValid === true) return cb(null, user);

          return cb(new errors.CustomError('WrongPassword'), false);
        });
      })
      .catch(cb);
  },
));


const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
};

passport.use(new JwtStrategy(jwtOpts, (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then(user => done(null, user))
    .catch(err => done(err, false));
}));

export default passport;
