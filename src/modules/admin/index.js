import express from 'express';
import path from 'path';

import categories from '../../constants/categories';

const admin = express();

// set the view engine to ejs
admin.set('view engine', 'ejs');
admin.set('views', path.join(__dirname, '..', '..', 'views'));

admin.get('/', (req, res) => {
  res.redirect('/admin/apps');
});

admin.get('/apps', (req, res) => {
  res.json({});
});

admin.get('/apps/add', (req, res) => {
  res.render('admin/apps/add', { categories });
});

module.exports = admin;
