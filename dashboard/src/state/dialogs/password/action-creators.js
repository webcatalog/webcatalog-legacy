import {
  DIALOG_ACCOUNT_PASSWORD_CLOSE,
  DIALOG_ACCOUNT_PASSWORD_FORM_UPDATE,
  DIALOG_ACCOUNT_PASSWORD_OPEN,
  DIALOG_ACCOUNT_PASSWORD_SAVE_REQUEST,
  DIALOG_ACCOUNT_PASSWORD_SAVE_SUCCESS,
} from '../../../constants/actions';

export const dialogAccountPasswordClose = () => ({
  type: DIALOG_ACCOUNT_PASSWORD_CLOSE,
});

export const dialogAccountPasswordOpen = () => ({
  type: DIALOG_ACCOUNT_PASSWORD_OPEN,
});


export const dialogAccountPasswordFormUpdate = changes => ({
  type: DIALOG_ACCOUNT_PASSWORD_FORM_UPDATE,
  changes,
});

export const dialogAccountPasswordSaveRequest = () => ({
  type: DIALOG_ACCOUNT_PASSWORD_SAVE_REQUEST,
});

export const dialogAccountPasswordSaveSuccess = () => ({
  type: DIALOG_ACCOUNT_PASSWORD_SAVE_SUCCESS,
});
