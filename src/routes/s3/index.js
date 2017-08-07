import express from 'express';

const s3Route = express.Router();

s3Route.get('/:name.:ext', (req, res) => {
  res.redirect(`https://s3.getwebcatalog.com/${req.params.name}.${req.params.ext}`);
});

module.exports = s3Route;
