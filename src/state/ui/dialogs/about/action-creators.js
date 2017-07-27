import {
  DIALOG_ACCOUNT_CLOSE,
  DIALOG_ACCOUNT_OPEN,
} from '../../../../constants/actions';

export const dialogAccountClose = () => ({
  type: DIALOG_ACCOUNT_CLOSE,
});

export const dialogAccountOpen = () => ({
  type: DIALOG_ACCOUNT_OPEN,
});
