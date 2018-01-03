import express from 'express';
import cache from 'memory-cache';

import index from '../algolia-index';

const sitemapRoute = express.Router();

sitemapRoute.get('/', (req, res, next) => {
  const cachedSitemap = cache.get('sitemap');

  if (cachedSitemap) {
    res.header('Content-Type', 'application/xml');
    res.send(cachedSitemap);
  } else {
    const browser = index.browseAll();
    let hits = [];

    browser.on('result', (content) => {
      hits = hits.concat(content.hits);
    });

    browser.on('end', () => {
      console.log('Finished!');
      console.log('We got %d hits', hits.length);

      const urls = [
        'https://webcatalog.io',
        'https://webcatalog.io/privacy',
        'https://webcatalog.io/terms',
      ]
        .concat(hits.map(app => `https://webcatalog.io/directory/app/${app.id}`));


      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

      urls.forEach((url) => {
        sitemap += `<url><loc>${url}</loc></url>`;
      });

      sitemap += '</urlset>';

      cache.put('sitemap', sitemap, 604800000); // 7 days in ms

      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    });

    browser.on('error', (err) => {
      next(err);
    });
  }
});

export default sitemapRoute;
