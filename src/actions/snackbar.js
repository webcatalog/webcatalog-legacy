import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from '../constants/actions';

export const openSnackbar = (message, actionText) => ({
  type: OPEN_SNACKBAR,
  message,
  actionText,
});

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR,
});
