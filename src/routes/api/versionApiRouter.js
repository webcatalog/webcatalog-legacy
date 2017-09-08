import express from 'express';
import fetch from 'node-fetch';

const versionApiRouter = express.Router();

versionApiRouter.get('/latest', (req, res, next) => {
  fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${process.env.VERSION}/package.json`)
    .then(response => response.text())
    .then((packageJson) => {
      const { version, dependencies } = packageJson;

      res.json({
        moleculeVersion: dependencies['@webcatalog/molecule'],
        version,
      });
    })
    .catch(next);
});

versionApiRouter.get('/beta', (req, res, next) => {
  fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${process.env.BETA_VERSION}/package.json`)
    .then(response => response.text())
    .then((packageJson) => {
      const { version, dependencies } = packageJson;

      res.json({
        moleculeVersion: dependencies['@webcatalog/molecule'],
        version,
      });
    })
    .catch(next);
});

module.exports = versionApiRouter;
