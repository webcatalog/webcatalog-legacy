import {
  dialogPreferencesClose,
  dialogPreferencesOpen,
  dialogPreferencesSectionChange,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogPreferencesClose());

export const open = () =>
  dispatch => dispatch(dialogPreferencesOpen());

export const sectionChange = section =>
  dispatch => dispatch(dialogPreferencesSectionChange(section));
