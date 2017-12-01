import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import sassMiddleware from 'node-sass-middleware';
import accepts from 'accepts';

import allRoutes from './routes';

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

// ensure non-www
app.all(/.*/, (req, res, next) => {
  const host = req.header('host');
  if (process.env.NODE_ENV === 'production' && host !== 'webcatalog.io') {
    res.redirect(301, `https://webcatalog.io${req.url}`);
  } else {
    next();
  }
});

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
  res.locals.isProduction = (process.env.NODE_ENV === 'production');
  res.locals.path = req.path || '';

  res.locals.description = 'WebCatalog - Run Web Apps Like Real Apps.';

  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// eslint-disable-next-line
app.use('/', allRoutes);

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
