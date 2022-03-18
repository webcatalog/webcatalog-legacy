/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import { makeStyles } from '@material-ui/core';

import SearchBox from './search-box';

import EnhancedAppBar from '../../shared/enhanced-app-bar';
import CreateButton from '../../shared/create-button';

const useStyles = makeStyles((theme) => ({
  backButton: {
    marginLeft: theme.spacing(1),
  },
  noDrag: {
    WebkitAppRegion: 'no-drag',
  },
  centerContainer: {
    display: 'flex',
    maxWidth: 480,
    margin: '0 auto',
  },
}));

const DefinedAppBar = () => {
  const classes = useStyles();

  return (
    <EnhancedAppBar
      center={(
        <div className={classes.centerContainer}>
          <SearchBox />
          <CreateButton />
        </div>
      )}
    />
  );
};

export default DefinedAppBar;
