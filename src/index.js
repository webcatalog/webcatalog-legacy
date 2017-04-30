import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import session from 'express-session';
import passport from 'passport';

import User from './models/User';

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
app.use('/public', express.static(path.join(__dirname, 'public')));

// passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
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

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  res.locals.user = req.user;

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
  res.status(500).render('error', { errorCode: 500, errorMessage: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).render('error', { errorCode: 404, errorMessage: 'Page Not Found' });
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
