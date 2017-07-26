import { openSnackbar } from '../../actions/snackbar';

import {
  DIALOG_CONFIRM_UNINSTALL_APP_CLOSE,
  DIALOG_CONFIRM_UNINSTALL_APP_OPEN,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS,
} from '../../constants/actions';

export const close = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_CONFIRM_UNINSTALL_APP_CLOSE });
  };

export const open = form =>
  (dispatch) => {
    dispatch({
      type: DIALOG_CONFIRM_UNINSTALL_APP_OPEN,
      form,
    });
  };

export const save = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST });
    setTimeout(() => {
      dispatch({ type: DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS });
      dispatch(openSnackbar('Your app has been successfully uninstalled.'));
      dispatch({ type: DIALOG_CONFIRM_UNINSTALL_APP_CLOSE });
    }, 1000);
  };
