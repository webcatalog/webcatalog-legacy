import {
  DIALOG_CREATE_CUSTOM_APP_CREATE_FAILED,
  DIALOG_CREATE_CUSTOM_APP_CREATE_REQUEST,
  DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
} from '../../../constants/actions';

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
