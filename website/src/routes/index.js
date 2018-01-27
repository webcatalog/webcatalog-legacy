import express from 'express';
import apiRoutes from './api';
import sitemapRoute from './sitemap';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});


router.get('/9', (req, res) => {
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

router.use('/api', apiRoutes);
router.use('/sitemap.xml', sitemapRoute);

export default router;
