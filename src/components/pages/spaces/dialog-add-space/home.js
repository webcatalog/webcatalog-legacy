/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import { SearchProvider, WithSearch } from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Typography from '@material-ui/core/Typography';

import AppCard from './app-card';
import NoConnection from './no-connection';
import CreateCustomSpaceCard from './create-custom-space-card';

const useStyles = makeStyles((theme) => ({
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
}));

const connector = process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY
  ? new AppSearchAPIConnector({
    searchKey: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_SEARCH_KEY,
    engineName: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_ENGINE_NAME,
    endpointBase: process.env.REACT_APP_ELASTIC_CLOUD_APP_SEARCH_API_ENDPOINT,
  }) : null;

const filters = [
  { field: 'type', values: ['Multisite'], type: 'all' },
];

const Home = () => {
  const classes = useStyles();
  const installedAppIds = useSelector((state) => state.appManagement.sortedAppIds);

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
    <>
      <CreateCustomSpaceCard />
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
          // we already use `trackUrlState`
          // (URL parameters) for the SearchProvider component in Catalog page
          // so `trackUrlState` must be disabled here to prevent conflicts
          // for example, page URL parameter of catalog Provider might be used by this
          // so if a user goes to page 10 in the catalog page
          // this component will also attemp to load page 10 instead of page 1 on first load
          trackUrlState: false,
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
                  </>
                );
              }}
            </WithSearch>
          </div>
        </div>
      </SearchProvider>
    </>
  );
};

export default Home;
