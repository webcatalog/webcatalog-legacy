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
  (dispatch) => {
    dispatch(dialogConfirmUninstallAppSaveRequest());
    setTimeout(() => {
      dispatch(dialogConfirmUninstallAppSaveSuccess());
      dispatch(openSnackbar('Your app has been successfully uninstalled.'));
      dispatch(close());
    }, 1000);
  };
