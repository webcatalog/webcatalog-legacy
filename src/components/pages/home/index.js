/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import {
  WithSearch, Paging,
} from '@elastic/react-search-ui';
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

import AppCard from '../../shared/app-card';
import SubmitAppCard from '../../shared/submit-app-card';
import CreateCustomAppCard from '../../shared/create-custom-app-card';

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
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
  },
});

const Home = forwardRef(({ classes }, scrollContainerRef) => (
  <Grid item xs className={classes.mainArea}>
    <DefinedAppBar />
    <SecondaryToolbar />
    <Divider />
    <div className={classes.scrollContainer} ref={scrollContainerRef}>
      <Grid item xs container spacing={1} justify="space-evenly">
        <WithSearch
          mapContextToProps={({
            error,
            filters,
            isLoading,
            results,
            searchTerm,
            setSearchTerm,
            wasSearched,
          }) => ({
            error,
            filters,
            isLoading,
            results,
            searchTerm,
            setSearchTerm,
            wasSearched,
          })}
        >
          {({
            error,
            filters,
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

            if (isLoading && !error && results.length < 1) {
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
                    <CreateCustomAppCard />
                  </Grid>
                </EmptyState>
              );
            }

            const typeFilter = filters.find((filter) => filter.field === 'type');
            return (
              <>
                <CreateCustomAppCard urlDisabled={typeFilter && typeFilter.values[0] === 'Multisite'} />
                {results.map((app) => (
                  <AppCard
                    key={app.id.raw}
                    id={app.id.raw}
                    name={app.name.raw}
                    url={app.url.raw}
                    category={app.category.raw}
                    widevine={app.widevine.raw === 1}
                    icon={window.process.platform === 'win32' // use unplated icon for Windows
                      ? app.icon_unplated.raw : app.icon.raw}
                    iconThumbnail={window.process.platform === 'win32' // use unplated icon for Windows
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
    </div>
  </Grid>
));

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Home,
  null,
  null,
  styles,
  { forwardRef: true },
);
