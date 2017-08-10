import { openSnackbar } from '../../snackbar/actions';

import uninstallAppAsync from '../../../utils/uninstallAppAsync';

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
    const { app } = getState().dialogs.confirmUninstallApp.form;

    dispatch(dialogConfirmUninstallAppSaveRequest());

    uninstallAppAsync(app.id, app.name)
      .then(() => {
        dispatch(dialogConfirmUninstallAppSaveSuccess());
        dispatch(openSnackbar(`${app.name} has been successfully uninstalled.`));
        dispatch(close());
      })
      .catch((err) => {
        dispatch(dialogConfirmUninstallAppSaveSuccess());
        dispatch(openSnackbar(`We're sorry. WebCatalog has failed to uninstall ${app.name}.`));
        // eslint-disable-next-line
        console.log(err);
      });
  };
