import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

// load .env
require('dotenv').config();

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use('/', express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', { version: process.env.VERSION || 'local' });
});

app.use('/admin', require('./modules/admin'));

// Error handler
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
/* eslint-enable no-unused-vars */
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
