import {
  DIALOG_SETTINGS_ADVANCED_FORM_UPDATE,
  DIALOG_SETTINGS_ADVANCED_SAVE_REQUEST,
  DIALOG_SETTINGS_ADVANCED_SAVE_SUCCESS,
} from '../../../../constants/actions';

export const dialogSettingsAdvancedFormUpdate = changes => ({
  type: DIALOG_SETTINGS_ADVANCED_FORM_UPDATE,
  changes,
});

export const dialogSettingsAdvancedSaveRequest = () => ({
  type: DIALOG_SETTINGS_ADVANCED_SAVE_REQUEST,
});

export const dialogSettingsAdvancedSaveSuccess = () => ({
  type: DIALOG_SETTINGS_ADVANCED_SAVE_SUCCESS,
});
