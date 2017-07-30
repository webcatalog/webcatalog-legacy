/* global ipcRenderer */
import { openSnackbar } from '../../snackbar/actions';

import {
  dialogConfirmUninstallAppClose,
  dialogConfirmUninstallAppOpen,
  dialogConfirmUninstallAppSaveRequest,
  dialogConfirmUninstallAppSaveSuccess,
} from './action-creators';

export const close = () =>
  (dispatch) => {
    dispatch(dialogConfirmUninstallAppClose());
  };

export const open = form =>
  (dispatch) => {
    dispatch(dialogConfirmUninstallAppOpen(form));
  };

export const save = () =>
  (dispatch, getState) => {
    const { app } = getState().ui.dialogs.confirmUninstallApp.form;

    dispatch(dialogConfirmUninstallAppSaveRequest());

    const listener = (e, id, status) => {
      if (id === app.id && status === null) {
        dispatch(dialogConfirmUninstallAppSaveSuccess());
        dispatch(openSnackbar('Your app has been successfully uninstalled.'));
        dispatch(close());

        ipcRenderer.removeListener('set-managed-app', listener);
      }
    };

    ipcRenderer.on('set-managed-app', listener);

    ipcRenderer.send('uninstall-app', app.id, app);
  };
