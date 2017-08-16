import {
  DIALOG_SETTINGS_BASIC_FORM_UPDATE,
  DIALOG_SETTINGS_BASIC_SAVE_REQUEST,
  DIALOG_SETTINGS_BASIC_SAVE_SUCCESS,
} from '../../../../constants/actions';

export const dialogSettingsBasicFormUpdate = changes => ({
  type: DIALOG_SETTINGS_BASIC_FORM_UPDATE,
  changes,
});

export const dialogSettingsBasicSaveRequest = () => ({
  type: DIALOG_SETTINGS_BASIC_SAVE_REQUEST,
});

export const dialogSettingsBasicSaveSuccess = () => ({
  type: DIALOG_SETTINGS_BASIC_SAVE_SUCCESS,
});
