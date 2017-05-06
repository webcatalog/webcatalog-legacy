import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';
import accepts from 'accepts';
import connectSessionSequelize from 'connect-session-sequelize';
import { SecureMode } from 'intercom-client';

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
app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: '30days' }));

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

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  res.locals.isProduction = (process.env.NODE_ENV === 'production');
  res.locals.path = req.path;
  res.locals.user = req.user;
  res.locals.description = 'WebCatalog is an app store with thousands of exclusive apps for your Mac and PC.';

  if (req.user) {
    res.locals.intercomUserHash =
      SecureMode.userHash({ secretKey: process.env.INTERCOM_SECRET, identifier: req.user.id });
  }

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
app.use('/me', require('./routes/me'));
app.use('/submit', require('./routes/submit'));

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

      console.log(err);
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
