import express from 'express';
import fetch from 'node-fetch';

const versionApiRouter = express.Router();

versionApiRouter.get('/latest', (req, res, next) => {
  fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${process.env.VERSION}/package.json`)
    .then(response => response.json())
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
