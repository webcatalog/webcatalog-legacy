import {
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
} from '../../../constants/actions';

export const snackbarOpen = (message, actionText) => ({
  type: OPEN_SNACKBAR,
  message,
  actionText,
});

export const snackbarClose = () => ({
  type: CLOSE_SNACKBAR,
});
