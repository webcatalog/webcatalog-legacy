import algoliasearch from 'algoliasearch';

import { ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY } from '../constants/algolia';

const getObjectsAsync = ({ objectIds }) =>
  new Promise((resolve, reject) => {
    const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY);
    const index = client.initIndex('webcatalog');
    index.getObjects(objectIds, (err, content) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(content);
    });
  });

export default getObjectsAsync;
