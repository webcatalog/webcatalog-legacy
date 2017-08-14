import {
  DIALOG_SETTINGS_CLOSE,
  DIALOG_SETTINGS_OPEN,
  DIALOG_SETTINGS_SECTION_CHANGE,
} from '../../../constants/actions';

export const dialogSettingsClose = () => ({
  type: DIALOG_SETTINGS_CLOSE,
});

export const dialogSettingsOpen = () => ({
  type: DIALOG_SETTINGS_OPEN,
});

export const dialogSettingsSectionChange = section => ({
  type: DIALOG_SETTINGS_SECTION_CHANGE,
  section,
});
