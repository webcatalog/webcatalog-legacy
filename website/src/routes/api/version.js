import express from 'express';
import fetch from 'node-fetch';

const versionApiRouter = express.Router();

let cachedResponse;
versionApiRouter.get('/latest', (req, res, next) => {
  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  return fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${process.env.VERSION}/package.json`)
    .then(response => response.json())
    .then((packageJson) => {
      const { version, dependencies } = packageJson;

      cachedResponse = {
        moleculeVersion: dependencies['@webcatalog/molecule'],
        version,
      };

      return res.json(cachedResponse);
    })
    .catch(next);
});

export default versionApiRouter;
