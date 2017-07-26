import {
  snackbarClose,
  snackbarOpen,
} from './action-creators';

export const closeSnackbar = () =>
  dispatch => dispatch(snackbarClose());

export const openSnackbar = (message, actionText) =>
  dispatch => dispatch(snackbarOpen(message, actionText));
