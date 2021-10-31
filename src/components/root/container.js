/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import connectComponent from '../../helpers/connect-component';

import {
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
  ROUTE_SPACES,
} from '../../constants/routes';

import Preferences from '../pages/preferences';
import Installed from '../pages/installed';
import Home from '../pages/home';
import Spaces from '../pages/spaces';

import Sidebar from './sidebar';

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

const Container = ({
  classes,
  route,
}) => {
  return (
    <div className={classes.root}>
      <Sidebar />
      <Grid container className={classes.container}>
        {route === ROUTE_INSTALLED && <Installed />}
        {route === ROUTE_SPACES && <Spaces />}
        {route === ROUTE_PREFERENCES && <Preferences />}
        {route === ROUTE_HOME && <Home />}
      </Grid>
    </div>
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
