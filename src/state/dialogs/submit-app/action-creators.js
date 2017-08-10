import {
  DIALOG_SUBMIT_APP_CLOSE,
  DIALOG_SUBMIT_APP_OPEN,
  DIALOG_SUBMIT_APP_FORM_UPDATE,
  DIALOG_SUBMIT_APP_SAVE_REQUEST,
  DIALOG_SUBMIT_APP_SAVE_SUCCESS,
} from '../../../constants/actions';

export const dialogSubmitAppClose = () => ({
  type: DIALOG_SUBMIT_APP_CLOSE,
});

export const dialogSubmitAppOpen = () => ({
  type: DIALOG_SUBMIT_APP_OPEN,
});

export const dialogSubmitAppFormUpdate = changes => ({
  type: DIALOG_SUBMIT_APP_FORM_UPDATE,
  changes,
});

export const dialogSubmitAppSaveRequest = () => ({
  type: DIALOG_SUBMIT_APP_SAVE_REQUEST,
});

export const dialogSubmitAppSaveSuccess = () => ({
  type: DIALOG_SUBMIT_APP_SAVE_SUCCESS,
});
