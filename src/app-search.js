/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as ElasticAppSearch from '@elastic/app-search-javascript';

const client = ElasticAppSearch.createClient({
  searchKey: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY,
  endpointBase: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT,
  engineName: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME,
});

export default client;
