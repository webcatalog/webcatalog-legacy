import {
  dialogSettingsClose,
  dialogSettingsOpen,
  dialogSettingsSectionChange,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogSettingsClose());

export const open = () =>
  dispatch => dispatch(dialogSettingsOpen());

export const sectionChange = section =>
  dispatch => dispatch(dialogSettingsSectionChange(section));
