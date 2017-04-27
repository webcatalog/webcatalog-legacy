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

const handleDownloads = (req, res) => {
  const ua = req.headers['user-agent'];
  if (/(Intel|PPC) Mac OS X/.test(ua)) {
    res.redirect('/downloads/mac');
  } else if (/(Linux x86_64|Linux i686)/.test(ua)) {
    res.redirect('/downloads/linux');
  } else {
    res.redirect('/downloads/windows');
  }
};

app.get('/', handleDownloads);
app.get('/downloads', handleDownloads);

app.get('/downloads/mac', (req, res) => {
  res.render('downloads/index', { version: process.env.VERSION, platform: 'mac' });
});

app.get('/downloads/windows', (req, res) => {
  res.render('downloads/index', { version: process.env.VERSION, platform: 'windows' });
});

app.get('/downloads/linux', (req, res) => {
  res.render('downloads/index', { version: process.env.VERSION, platform: 'linux' });
});

app.use('/admin', require('./modules/admin'));
app.use('/api', require('./modules/api'));
app.use('/s3', require('./modules/s3'));

// Error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
  console.error(JSON.stringify(err));
  res.status(500).send('Something broke!');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
