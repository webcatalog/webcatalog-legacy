import algoliasearch from 'algoliasearch';

import { ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY } from '../constants/algolia';

const fetchAppDataAsync = ({ objectIds }) =>
  new Promise((resolve, reject) => {
    const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_APPLICATION_KEY);
    const index = client.initIndex('webcatalog');
    index.getObjects(objectIds, (err, content) => {
      if (err) {
        reject(err);
        return;
      }

      const hits = content.results ? content.results.filter(hit => hit !== null) : [];

      resolve(hits);
    });
  });

export default fetchAppDataAsync;
