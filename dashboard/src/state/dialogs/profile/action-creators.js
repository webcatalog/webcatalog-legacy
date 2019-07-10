import {
  DIALOG_ACCOUNT_PROFILE_CLOSE,
  DIALOG_ACCOUNT_PROFILE_FORM_UPDATE,
  DIALOG_ACCOUNT_PROFILE_OPEN,
  DIALOG_ACCOUNT_PROFILE_SAVE_REQUEST,
  DIALOG_ACCOUNT_PROFILE_SAVE_SUCCESS,
} from '../../../constants/actions';

export const dialogAccountProfileClose = () => ({
  type: DIALOG_ACCOUNT_PROFILE_CLOSE,
});

export const dialogAccountProfileOpen = () => ({
  type: DIALOG_ACCOUNT_PROFILE_OPEN,
});


export const dialogAccountProfileFormUpdate = changes => ({
  type: DIALOG_ACCOUNT_PROFILE_FORM_UPDATE,
  changes,
});

export const dialogAccountProfileSaveRequest = () => ({
  type: DIALOG_ACCOUNT_PROFILE_SAVE_REQUEST,
});

export const dialogAccountProfileSaveSuccess = () => ({
  type: DIALOG_ACCOUNT_PROFILE_SAVE_SUCCESS,
});
