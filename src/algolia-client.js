import algoliasearch from 'algoliasearch';

const algoliaClient = algoliasearch(
  process.env.ALGOLIASEARCH_APPLICATION_ID,
  process.env.ALGOLIASEARCH_API_KEY,
);

export default algoliaClient;
