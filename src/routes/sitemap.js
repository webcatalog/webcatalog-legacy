import express from 'express';

const sitemapRoute = express.Router();

sitemapRoute.get('/', (req, res) => {
  const urls = [
    'https://webcatalog.io',
    'https://webcatalog.io/privacy',
    'https://webcatalog.io/terms',
  ];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  urls.forEach((url) => {
    sitemap += `<url><loc>${url}</loc></url>`;
  });

  sitemap += '</urlset>';

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

export default sitemapRoute;
