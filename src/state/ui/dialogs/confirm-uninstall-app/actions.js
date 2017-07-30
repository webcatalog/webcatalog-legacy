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
    ipcRenderer.send('uninstall-app', app.id, app);
    setTimeout(() => {
      dispatch(dialogConfirmUninstallAppSaveSuccess());
      dispatch(openSnackbar('Your app has been successfully uninstalled.'));
      dispatch(close());
    }, 1000);
  };
