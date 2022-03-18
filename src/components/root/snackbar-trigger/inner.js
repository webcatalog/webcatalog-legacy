/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useCallback } from 'react';
import { dialog, getCurrentWindow } from '@electron/remote';

import Button from '@material-ui/core/Button';

import { useSnackbar } from 'notistack';

import {
  requestOpenApp,
  requestRestart,
} from '../../../senders';

const SnackbarTriggerInner = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    window.ipcRenderer.on('enqueue-snackbar', (_, message, variant, actionData) => {
      let action;
      if (actionData) {
        switch (actionData.type) {
          case 'open-app': {
            action = (key) => (
              <>
                <Button color="inherit" onClick={() => requestOpenApp(actionData.id, actionData.name)}>
                  Open
                </Button>
                <Button color="inherit" onClick={() => closeSnackbar(key)}>
                  Dismiss
                </Button>
              </>
            );
            break;
          }
          case 'show-details': {
            action = (key) => (
              <>
                <Button
                  color="inherit"
                  onClick={() => {
                    dialog.showMessageBox(getCurrentWindow(), {
                      message: actionData.text,
                    }).catch(console.log); // eslint-disable-line
                  }}
                >
                  Show Details
                </Button>
                <Button color="inherit" onClick={() => closeSnackbar(key)}>
                  Dismiss
                </Button>
              </>
            );
            break;
          }
          default: break;
        }
      }

      enqueueSnackbar(message, { variant, autoHideDuration: 10000, action });
    });
    return () => {
      window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    };
  }, [enqueueSnackbar, closeSnackbar]);

  const showRequestRestartSnackbar = useCallback(() => {
    enqueueSnackbar('You need to restart the app for the changes to take effect.', {
      variant: 'default',
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

export default SnackbarTriggerInner;
