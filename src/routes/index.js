import express from 'express';
import fetch from 'node-fetch';
import marked from 'marked';
import apiRoutes from './api';
import sitemapRoute from './sitemap';
import directoryRoute from './directory';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('download', {
    version: process.env.VERSION,
  });
});

router.get(['/download', '/downloads'], (req, res) => {
  res.redirect('/');
});

router.get('/downloads/:platform(mac|windows|linux)', (req, res) => {
  res.redirect('/');
});

router.get('/download/:platform(mac|windows|linux)', (req, res) => {
  res.redirect('/');
});

let cachedContent;
router.get('/release-notes', (req, res, next) => {
  if (cachedContent) {
    return res.render('release-notes', { title: 'Release Notes', releaseNotes: marked(cachedContent) });
  }

  return fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${process.env.VERSION}/RELEASE_NOTES.md`)
    .then(response => response.text())
    .then((mdContent) => {
      cachedContent = mdContent;
      return res.render('release-notes', { title: 'Release Notes', releaseNotes: marked(mdContent) });
    })
    .catch(next);
});

router.get('/support', (req, res) => {
  res.redirect('/contact');
});

router.get('/help', (req, res) => {
  res.redirect('/contact');
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

router.get('/privacy', (req, res) => {
  res.render('privacy', { title: 'Privacy Policy' });
});

router.get('/terms', (req, res) => {
  res.render('terms', { title: 'Terms of Service' });
});

router.get('/s3/:name.:ext', (req, res) => {
  res.redirect(`https://cdn.webcatalog.io/${req.params.name}.${req.params.ext}`);
});

router.use('/directory', directoryRoute);
router.use('/api', apiRoutes);
router.use('/sitemap.xml', sitemapRoute);

export default router;
