import express from 'express';

const versionApiRouter = express.Router();

versionApiRouter.get('/latest', (req, res) => {
  res.json({
    moleculeVersion: '1.0.0',
    version: process.env.VERSION,
  });
});

versionApiRouter.get('/beta', (req, res) => {
  res.json({
    moleculeVersion: '1.0.0',
    version: process.env.VERSION_BETA,
  });
});

module.exports = versionApiRouter;
