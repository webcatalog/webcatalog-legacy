/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import { makeStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import EnhancedAppBar from '../../shared/enhanced-app-bar';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center',
    color: 'inherit',
    fontWeight: 400,
  },
}));

const DefinedAppBar = () => {
  const classes = useStyles();

  return (
    <EnhancedAppBar
      center={(
        <Typography variant="body1" className={classes.title}>
          Preferences
        </Typography>
      )}
    />
  );
};

export default DefinedAppBar;
