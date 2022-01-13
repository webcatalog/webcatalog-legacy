/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Grid } from '@material-ui/core';

import connectComponent from '../../../helpers/connect-component';

import DefinedAppBar from './defined-app-bar';
import InstalledSpaces from './installed-spaces';
import AddCard from './add-card';
import DialogAddSpace from './dialog-add-space';

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  descriptionContainer: {
    margin: '0 auto',
    textAlign: 'center',
  },
  gridContainer: {
    paddingTop: theme.spacing(15),
  },
});

const Preferences = ({
  classes,
}) => (
  <div className={classes.root}>
    <DefinedAppBar />
    <div className={classes.scrollContainer}>
      <div className={classes.descriptionContainer}>
        <Typography variant="body1" color="textSecondary">
          With WebCatalog Spaces, you can organize your apps into
          tidy collections.
          <br />
          Create spaces for friends and family, or split between work and play.
        </Typography>
      </div>

      <div className={classes.gridContainer}>
        <Grid item xs container spacing={1} justifyContent="center">
          <InstalledSpaces />
          <AddCard />
        </Grid>
      </div>
    </div>
    <DialogAddSpace />
  </div>
);

Preferences.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Preferences,
  null,
  null,
  styles,
);
