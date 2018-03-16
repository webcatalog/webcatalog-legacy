import {
  DIALOG_CREATE_CUSTOM_APP_CLOSE,
  DIALOG_CREATE_CUSTOM_APP_CREATE_FAILED,
  DIALOG_CREATE_CUSTOM_APP_CREATE_REQUEST,
  DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_OPEN,
} from '../../../constants/actions';

export const createCustomAppClose = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CLOSE,
});

export const createCustomAppOpen = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_OPEN,
});

export const createCustomAppFormUpdate = changes => ({
  type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  changes,
});

export const createCustomAppCreateRequest = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CREATE_REQUEST,
});

export const createCustomAppCreateSuccess = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS,
});

export const createCustomAppCreateFailed = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CREATE_FAILED,
});
