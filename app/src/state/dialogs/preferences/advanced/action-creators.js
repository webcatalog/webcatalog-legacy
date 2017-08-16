import {
  DIALOG_PREFERENCES_ADVANCED_FORM_UPDATE,
  DIALOG_PREFERENCES_ADVANCED_SAVE_REQUEST,
  DIALOG_PREFERENCES_ADVANCED_SAVE_SUCCESS,
} from '../../../../constants/actions';

export const dialogPreferencesAdvancedFormUpdate = changes => ({
  type: DIALOG_PREFERENCES_ADVANCED_FORM_UPDATE,
  changes,
});

export const dialogPreferencesAdvancedSaveRequest = () => ({
  type: DIALOG_PREFERENCES_ADVANCED_SAVE_REQUEST,
});

export const dialogPreferencesAdvancedSaveSuccess = () => ({
  type: DIALOG_PREFERENCES_ADVANCED_SAVE_SUCCESS,
});
