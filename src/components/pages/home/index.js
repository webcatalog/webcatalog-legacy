/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import {
  SearchProvider, WithSearch, Paging, Facet,
} from '@elastic/react-search-ui';
import { MultiCheckboxFacet } from '@elastic/react-search-ui-views';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import SearchIcon from '@material-ui/icons/Search';

import connectComponent from '../../../helpers/connect-component';

import EmptyState from '../../shared/empty-state';
import NoConnection from '../../shared/no-connection';

import DefinedAppBar from './defined-app-bar';
import SecondaryToolbar from './toolbar';
import SubmitAppCard from './submit-app-card';

import AppCard from '../../shared/app-card';

const connector = new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
});

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  noMatchingResultOpts: {
    marginTop: theme.spacing(4),
  },
  facet: {
    paddingRight: theme.spacing(2),
    color: theme.palette.text.primary,
  },
});

const Home = ({
  classes,
}) => (
  <SearchProvider
    config={{
      apiConnector: connector,
      initialState: {
        resultsPerPage: 60,
        sortField: '',
        sortDirection: '',
      },
      alwaysSearchOnInitialLoad: true,
      searchQuery: {
        disjunctiveFacets: ['type', 'category'],
        result_fields: {
          id: { raw: {} },
          name: { raw: {} },
          url: { raw: {} },
          icon: window.process.platform === 'win32' ? undefined : { raw: {} },
          icon_128: window.process.platform === 'win32' ? undefined : { raw: {} },
          icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
          icon_unplated_128: window.process.platform === 'win32' ? { raw: {} } : undefined,
        },
        facets: {
          type: { type: 'value', size: 2 },
          category: { type: 'value', size: 30 },
        },
      },
    }}
  >
    <div className={classes.root}>
      <DefinedAppBar />
      <SecondaryToolbar />
      <Divider />
      <div className={classes.scrollContainer}>
        <Grid container>
          <Grid item>
            <Facet
              className={classes.facet}
              field="type"
              label="Types"
              view={MultiCheckboxFacet}
              show={2}
              filterType="any"
            />
            <Facet
              className={classes.facet}
              field="category"
              label="Categories"
              view={MultiCheckboxFacet}
              show={30}
              filterType="any"
            />
          </Grid>
          <Grid item xs container spacing={1} justify="space-evenly">
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
                isLoading,
                results,
                searchTerm,
                setSearchTerm,
                wasSearched,
              }) => {
                if (error) {
                  return (
                    <div className={classes.noConnectionContainer}>
                      <NoConnection
                        onTryAgainButtonClick={() => {
                          setSearchTerm(searchTerm, { refresh: true, debounce: 0 });
                        }}
                      />
                    </div>
                  );
                }

                if (isLoading && results.length < 1) {
                  return (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        align="center"
                        color="textSecondary"
                        className={classes.loading}
                      >
                        Loading...
                      </Typography>
                    </Grid>
                  );
                }

                if (wasSearched && results.length < 1) {
                  return (
                    <EmptyState icon={SearchIcon} title="No Matching Results">
                      <Typography
                        variant="subtitle1"
                        align="center"
                      >
                        Your query did not match any apps in our database.
                      </Typography>
                      <Grid container justify="center" spacing={1} className={classes.noMatchingResultOpts}>
                        <SubmitAppCard />
                      </Grid>
                    </EmptyState>
                  );
                }

                return (
                  <>
                    {results.map((app) => (
                      <AppCard
                        key={app.id.raw}
                        id={app.id.raw}
                        name={app.name.raw}
                        url={app.url.raw}
                        icon={window.process.platform === 'win32' // use unplated icon for Windows
                          ? app.icon_unplated.raw : app.icon.raw}
                        icon128={window.process.platform === 'win32' // use unplated icon for Windows
                          ? app.icon_unplated_128.raw : app.icon_128.raw}
                      />
                    ))}
                    <Grid item xs={12} container justify="center">
                      <Paging />
                    </Grid>
                  </>
                );
              }}
            </WithSearch>
          </Grid>
        </Grid>
      </div>
    </div>
  </SearchProvider>
);

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Home,
  null,
  null,
  styles,
);
