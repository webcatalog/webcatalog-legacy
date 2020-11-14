/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { SnackbarProvider } from 'notistack';

import connectComponent from '../../../helpers/connect-component';

import Inner from './inner';

const styles = () => ({
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
});

const SnackbarTrigger = ({ classes }) => {
  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: 'top',
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

SnackbarTrigger.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SnackbarTrigger,
  null,
  null,
  styles,
);
