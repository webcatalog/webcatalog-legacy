/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useCallback } from 'react';

import Button from '@material-ui/core/Button';

import { useSnackbar } from 'notistack';

import {
  requestRestart,
} from '../../senders';

const SnackbarTrigger = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    window.ipcRenderer.on('enqueue-snackbar', (_, message, variant) => {
      enqueueSnackbar(message, { variant, autoHideDuration: 10000 });
    });
    return () => {
      window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    };
  }, [enqueueSnackbar]);

  const showRequestRestartSnackbar = useCallback(() => {
    enqueueSnackbar('You need to restart the app for the changes to take effect.', {
      variant: 'error',
      preventDuplicate: true,
      persist: true,
      action: (key) => (
        <>
          <Button color="inherit" onClick={() => requestRestart()}>
            Restart Now
          </Button>
          <Button color="inherit" onClick={() => closeSnackbar(key)}>
            Later
          </Button>
        </>
      ),
    });
  }, [enqueueSnackbar, closeSnackbar]);

  useEffect(() => {
    window.ipcRenderer.removeAllListeners('enqueue-request-restart-snackbar');
    window.ipcRenderer.on('enqueue-request-restart-snackbar', showRequestRestartSnackbar);
    return () => {
      window.ipcRenderer.removeAllListeners('enqueue-request-restart-snackbar');
    };
  }, [showRequestRestartSnackbar]);

  return null;
};

export default SnackbarTrigger;
