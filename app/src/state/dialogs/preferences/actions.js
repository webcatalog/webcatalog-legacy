import {
  dialogPreferencesClose,
  dialogPreferencesOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogPreferencesClose());

export const open = () =>
  dispatch => dispatch(dialogPreferencesOpen());
