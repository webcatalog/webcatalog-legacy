/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';

import { SnackbarProvider } from 'notistack';

import Inner from './inner';

const useStyles = makeStyles(() => ({
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
}));

const SnackbarTrigger = () => {
  const classes = useStyles();

  const notistackRef = useRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      preventDuplicate
      classes={{
        containerRoot: classes.notistackContainerRoot,
      }}
      action={(key) => (
        <Button color="inherit" onClick={onClickDismiss(key)}>
          Dismiss
        </Button>
      )}
    >
      <Inner />
    </SnackbarProvider>
  );
};

export default SnackbarTrigger;
