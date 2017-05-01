import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import accepts from 'accepts';
import crypto from 'crypto';
import connectSessionSequelize from 'connect-session-sequelize';

import sequelize from './sequelize';
import User from './models/User';
import './models/Session';

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compact',
  indentedSyntax: true,
  prefix: '/public',
}));
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 3600 * 24 * 30 }));

// passport
const SequelizeStore = connectSessionSequelize(session.Store);
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db: sequelize,
    table: 'session',
    checkExpirationInterval: 15 * 60 * 1000, // interval to cleanup expired sessions
    expiration: 30 * 24 * 60 * 60 * 1000,  // 1 month
  }),
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
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
    console.log(profile);
    User
      .findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: { profilePicture: profile.photos[0].value },
      })
      .spread((user) => {
        // try to update new profile picture
        if (
          user.profilePicture !== profile.photos[0].value ||
          user.displayName !== profile.displayName
        ) {
          user.updateAttributes({
            profilePicture: profile.photos[0].value,
            displayName: profile.displayName,
          })
          .catch(console.log);
        }

        cb(null, user);
      })
      .catch(cb);
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


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  res.locals.isProduction = (process.env.NODE_ENV === 'production');
  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.description = 'WebCatalog is an app store with thousands of exclusive apps for your Mac and PC.';

  if (req.user) {
    const hmac = crypto.createHmac('sha256', process.env.INTERCOM_SECRET);
    hmac.update(req.user.id);
    res.locals.intercomUserHash = hmac.digest('hex');
  }

  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use('/', require('./routes/downloads'));
app.use('/apps', require('./routes/apps'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/s3', require('./routes/s3'));
app.use('/auth', require('./routes/auth'));

// Error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
  const accept = accepts(req);

  switch (accept.type(['json', 'html'])) {
    case 'json': {
      if (err.message === '404') {
        return res.status(404).json({ errors: [{ status: '404', title: 'Page Not Found' }] });
      }

      return res.status(500).json({ errors: [{ status: '500', title: 'Internal Server Error' }] });
    }
    default: {
      if (err.message === '404') {
        return res.status(404).render('error', { errorCode: 404, errorMessage: 'Page Not Found' });
      }

      console.log(err);
      return res.status(500).render('error', { errorCode: 500, errorMessage: 'Internal Server Error' });
    }
  }
});

app.use((req, res) => {
  const accept = accepts(req);

  switch (accept.type(['json', 'html'])) {
    case 'json': {
      return res.status(404).json({ errors: [{ status: '404', title: 'Page Not Found' }] });
    }
    default: {
      return res.status(404).render('error', { errorCode: 404, errorMessage: 'Page Not Found' });
    }
  }
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
