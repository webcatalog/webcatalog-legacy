import * as ElasticAppSearch from '@elastic/app-search-javascript';

const client = ElasticAppSearch.createClient({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
});

export default client;
