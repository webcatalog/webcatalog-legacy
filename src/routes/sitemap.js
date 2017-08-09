import express from 'express';

import App from '../models/App';
import categories from '../constants/categories';

const sitemapRoute = express.Router();

sitemapRoute.get('/', (req, res, next) => {
  App.findAll(({
    attributes: ['id', 'slug'],
    where: { isActive: true },
  }))
  .then((apps) => {
    const urls = [
      'https://getwebcatalog.com',
      'https://getwebcatalog.com/apps',
    ]
    .concat(categories.map(category => `https://getwebcatalog.com/apps/category/${category}`))
    .concat(apps.map(app => `https://getwebcatalog.com/apps/details/${app.slug}/${app.id}`));


    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    urls.forEach((url) => {
      sitemap += `<url><loc>${url}</loc></url>`;
    });

    sitemap += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  })
  .catch(next);
});

module.exports = sitemapRoute;
