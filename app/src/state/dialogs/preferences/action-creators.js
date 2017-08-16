import {
  DIALOG_PREFERENCES_CLOSE,
  DIALOG_PREFERENCES_OPEN,
  DIALOG_PREFERENCES_SECTION_CHANGE,
} from '../../../constants/actions';

export const dialogPreferencesClose = () => ({
  type: DIALOG_PREFERENCES_CLOSE,
});

export const dialogPreferencesOpen = () => ({
  type: DIALOG_PREFERENCES_OPEN,
});

export const dialogPreferencesSectionChange = section => ({
  type: DIALOG_PREFERENCES_SECTION_CHANGE,
  section,
});
