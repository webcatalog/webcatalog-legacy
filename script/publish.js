/* eslint-disable no-console */

const apps = require('../dist/index.json');
const algoliasearch = require('algoliasearch');

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_KEY);

const indexName = 'apps';
const tmpIndexName = `tmp_apps_${Date.now().toString()}`;

const tmpIndex = client.initIndex(tmpIndexName);
tmpIndex.addObjects(apps)
  .then(() => client.moveIndex(tmpIndexName, indexName))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
