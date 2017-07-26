import {
  DIALOG_APP_DETAILS_CLOSE,
  DIALOG_APP_DETAILS_OPEN,
} from '../../../../constants/actions';

export const dialogAppDetailsClose = () => ({
  type: DIALOG_APP_DETAILS_CLOSE,
});

export const dialogAppDetailsOpen = form => ({
  type: DIALOG_APP_DETAILS_OPEN,
  form,
});
