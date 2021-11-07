/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, WithSearch, Paging } from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import connectComponent from '../../../../helpers/connect-component';

import AppCard from './app-card';
import NoConnection from './no-connection';
import CreateCustomSpaceCard from './create-custom-space-card';

const styles = (theme) => ({
  paper: {
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 0,
    overflow: 'auto',
  },
  grid: {
    marginBottom: theme.spacing(1),
  },
  homeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  badConfigContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  contentContainer: {
    padding: theme.spacing(1),
  },
  progressContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    zIndex: 2,
  },
});

const connector = process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY
  ? new AppSearchAPIConnector({
    searchKey: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY,
    engineName: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME,
    endpointBase: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT,
  }) : null;

const filters = [
  { field: 'type', values: ['Multisite'], type: 'all' },
];

const Home = ({ classes, installedAppIds }) => {
  const scrollContainerRef = useRef(null);

  if (!connector) {
    return (
      <div className={classes.badConfigContainer}>
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
        >
          AppSearch environment variables are required for &quot;Catalog&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
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

          return next(state, queryConfig);
        },
        initialState: {
          resultsPerPage: 60,
          sortField: '',
          sortDirection: '',
        },
        alwaysSearchOnInitialLoad: true,
        searchQuery: {
          filters,
          result_fields: {
            id: { raw: {} },
            name: { raw: {} },
            description: { raw: {} },
            url: { raw: {} },
            icon: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
            icon_filled_128: { raw: {} },
          },
        },
      }}
    >
      <div className={classes.homeContainer}>
        <div
          className={classes.scrollContainer}
          ref={scrollContainerRef}
        >
          <WithSearch
            mapContextToProps={({
              error,
              isLoading,
              results,
              searchTerm,
              setSearchTerm,
              wasSearched,
            }) => ({
              error,
              isLoading,
              results,
              searchTerm,
              setSearchTerm,
              wasSearched,
            })}
          >
            {({
              error,
              results,
              searchTerm,
              setSearchTerm,
            }) => {
              if (error) {
                return (
                  <div className={classes.contentContainer}>
                    <NoConnection
                      onTryAgainButtonClick={() => {
                        setSearchTerm(searchTerm, {
                          refresh: true,
                          debounce: 0,
                          shouldClearFilters: false,
                        });
                      }}
                    />
                  </div>
                );
              }

              return (
                <>
                  <CreateCustomSpaceCard />
                  {results.map((app) => installedAppIds.indexOf(app.id.raw) < 0 && (
                    <AppCard
                      key={app.id.raw}
                      id={app.id.raw}
                      name={app.name.raw}
                      description={app.description.raw}
                      url={app.url.raw}
                      icon={window.process.platform === 'win32' // use unplated icon for Windows
                        ? app.icon_unplated.raw : app.icon.raw}
                      icon128={app.icon_filled_128.raw}
                    />
                  ))}
                  {results.length > 0 && (
                    <Grid container justify="center">
                      <Paging />
                    </Grid>
                  )}
                </>
              );
            }}
          </WithSearch>
        </div>
        <WithSearch
          mapContextToProps={({ isLoading }) => ({ isLoading })}
        >
          {({ isLoading }) => (
            <>
              {isLoading && (
                <div className={classes.progressContainer}>
                  <CircularProgress size={20} />
                </div>
              )}
            </>
          )}
        </WithSearch>
      </div>
    </SearchProvider>
  );
};

Home.defaultProps = {};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  installedAppIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  installedAppIds: state.appManagement.sortedAppIds,
});

export default connectComponent(
  Home,
  mapStateToProps,
  null,
  styles,
);
