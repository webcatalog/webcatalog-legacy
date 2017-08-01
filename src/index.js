import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';
import accepts from 'accepts';
import connectSessionSequelize from 'connect-session-sequelize';
import { IdentityVerification } from 'intercom-client';
import md5 from 'md5';

import passport from './passport';
import sequelize from './sequelize';
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

// app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: '30days' }));
app.use('/public', express.static(path.join(__dirname, 'public')));

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
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 month
  },
}));
app.use(passport.initialize());
app.use(passport.session());

// ensure non-www
app.all(/.*/, (req, res, next) => {
  const host = req.header('host');
  if (process.env.NODE_ENV === 'production' && host === 'www.getwebcatalog.com') {
    res.redirect(301, `https://getwebcatalog.com${req.url}`);
  } else {
    next();
  }
});

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  res.locals.isProduction = (process.env.NODE_ENV === 'production');
  res.locals.path = req.path;
  res.locals.sourceVersion = process.env.SOURCE_VERSION || 'localhost';

  if (req.user && !req.user.profilePicture) {
    const gravatarHash = md5(req.user.email.trim().toLowerCase());
    req.user.profilePicture = `https://www.gravatar.com/avatar/${gravatarHash}.jpg?s=64`;
  }
  res.locals.user = req.user;

  res.locals.description = 'WebCatalog is an app store with thousands of exclusive apps for your Mac and PC.';

  if (req.user) {
    res.locals.intercomUserHash =
      IdentityVerification.userHash({
        secretKey: process.env.INTERCOM_SECRET,
        identifier: req.user.id,
      });
  }

  res.locals.showIntercom = true;

  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use('/', require('./routes/main'));
app.use('/sitemap.xml', require('./routes/sitemap.xml'));
app.use('/apps', require('./routes/apps'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/s3', require('./routes/s3'));
app.use('/auth', require('./routes/auth'));
app.use('/submit', require('./routes/submit'));

// Error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
  const accept = accepts(req);

  switch (accept.type(['json', 'html'])) {
    case 'json': {
      if (err.code === 404) {
        return res.status(404).json({ error: { code: 'NotFound', message: 'Page Not Found' } });
      }

      console.log(JSON.stringify(err));

      return res.status(err.statusCode || 500).json({
        error: {
          code: err.name || 'InternalServerError',
          message: err.message || 'Internal Server Error',
        },
      });
    }
    default: {
      if (err.code === 404) {
        return res.status(404).render('error', { errorCode: 404, errorMessage: 'Page Not Found', title: '404 - Page Not Found' });
      }

      console.log(err);
      return res.status(500).render('error', { errorCode: 500, errorMessage: 'Internal Server Error', title: '500 - Internal Server Error' });
    }
  }
});

app.use((req, res) => {
  const accept = accepts(req);

  switch (accept.type(['json', 'html'])) {
    case 'json': {
      return res.status(404).json({ error: { code: 'NotFound', message: 'Page Not Found' } });
    }
    default: {
      return res.status(404).render('error', { errorCode: 404, errorMessage: 'Page Not Found', title: '404 - Page Not Found' });
    }
  }
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
