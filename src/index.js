import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';

// load .env
require('dotenv').config();

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

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use('/', require('./routes/downloads'));
app.use('/apps', require('./routes/apps'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/s3', require('./routes/s3'));

// Error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
  console.log(err);
  res.status(500).send('Something broke!');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
