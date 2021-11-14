/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import {
  SearchProvider,
} from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Typography from '@material-ui/core/Typography';

import connectComponent from '../../../helpers/connect-component';

import Home from './home';

const connector = process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY
  ? new AppSearchAPIConnector({
    searchKey: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY,
    engineName: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME,
    endpointBase: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT,
  }) : null;

const styles = () => ({
  badConfigRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

const Container = ({
  classes,
}) => {
  const scrollContainerRef = useRef(null);

  if (!connector) {
    return (
      <div
        className={classes.badConfigRoot}
      >
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
        >
          Elastic Cloud App Search environment variables are required for &quot;Discover&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
        </Typography>
      </div>
    );
  }

  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        onSearch: (state, queryConfig, next) => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }

          const updatedState = { ...state };
          // when searching, results should ALWAYS be listed by relevance
          if (state.searchTerm.length > 0) {
            updatedState.sortField = '';
            updatedState.sortDirection = '';
          }

          return next(updatedState, queryConfig);
        },
        initialState: {
          sortField: '',
          sortDirection: '',
          filters: [],
        },
        alwaysSearchOnInitialLoad: true,
        trackUrlState: true,
        searchQuery: {
          filters: [
            { field: 'type', values: ['Singlesite'], type: 'all' },
          ],
          resultsPerPage: 82,
          result_fields: {
            id: { raw: {} },
            name: { raw: {} },
            url: { raw: {} },
            category: { raw: {} },
            widevine: { raw: {} },
            require_instance_url: { raw: {} },
            icon: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_128: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
            icon_unplated_128: window.process.platform === 'win32' ? { raw: {} } : undefined,
          },
        },
      }}
    >
      <Home ref={scrollContainerRef} />
    </SearchProvider>
  );
};

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Container,
  null,
  null,
  styles,
);
