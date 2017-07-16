import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from '../constants/actions';

export const openSnackbar = message => ({
  type: OPEN_SNACKBAR,
  message,
});

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR,
});
