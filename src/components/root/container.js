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

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

import {
  ROUTE_CATEGORIES,
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
} from '../../constants/routes';

import Preferences from '../pages/preferences';
import Installed from '../pages/installed';
import Categories from '../pages/categories';
import Home from '../pages/home';

import Sidebar from './sidebar';

const connector = process.env.REACT_APP_SWIFTYPE_SEARCH_KEY ? new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
}) : null;

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  badConfigRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  noMatchingResultOpts: {
    marginTop: theme.spacing(4),
  },
  mainArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  container: {
    height: '100%',
    overflow: 'hidden',
    flex: 1,
  },
});

const filters = [];
// widevine is not supported on ARM64 Linux & Windows
if (window.process.platform === 'win32' || (window.process.platform === 'linux' && window.process.platform !== 'x64')) {
  filters.push({ field: 'widevine', values: [0], type: 'all' });
}

const Container = ({
  classes,
  route,
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
          Swiftype environment variables are required for &quot;Discover&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
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
        searchQuery: {
          resultsPerPage: 59,
          disjunctiveFacets: ['category'],
          result_fields: {
            id: { raw: {} },
            name: { raw: {} },
            url: { raw: {} },
            category: { raw: {} },
            widevine: { raw: {} },
            icon: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_128: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
            icon_unplated_128: window.process.platform === 'win32' ? { raw: {} } : undefined,
          },
          facets: {
            category: { type: 'value', size: 30 },
          },
          filters,
        },
      }}
    >
      <div className={classes.root}>
        <Sidebar />
        <Grid container className={classes.container}>
          {route === ROUTE_CATEGORIES && <Categories />}
          {route === ROUTE_INSTALLED && <Installed />}
          {route === ROUTE_PREFERENCES && <Preferences />}
          {route === ROUTE_HOME && <Home ref={scrollContainerRef} />}
        </Grid>
      </div>
    </SearchProvider>
  );
};

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  route: state.router.route,
});

export default connectComponent(
  Container,
  mapStateToProps,
  null,
  styles,
);
