import {
  DIALOG_PREFERENCES_BASIC_FORM_UPDATE,
  DIALOG_PREFERENCES_BASIC_SAVE_REQUEST,
  DIALOG_PREFERENCES_BASIC_SAVE_SUCCESS,
} from '../../../../constants/actions';

export const dialogPreferencesBasicFormUpdate = changes => ({
  type: DIALOG_PREFERENCES_BASIC_FORM_UPDATE,
  changes,
});

export const dialogPreferencesBasicSaveRequest = () => ({
  type: DIALOG_PREFERENCES_BASIC_SAVE_REQUEST,
});

export const dialogPreferencesBasicSaveSuccess = () => ({
  type: DIALOG_PREFERENCES_BASIC_SAVE_SUCCESS,
});
