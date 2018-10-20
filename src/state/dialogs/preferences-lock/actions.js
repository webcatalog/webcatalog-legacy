import {
  dialogPreferencesLockClose,
  dialogPreferencesLockOpen,
  dialogPreferencesLockFormUpdate,
} from './action-creators';

import { STRING_INCORRECT_PASSWORD } from '../../../constants/strings';

import { open as openDialogPreferences } from '../preferences/actions';

export const close = () => dispatch => dispatch(dialogPreferencesLockClose());

export const open = () => (dispatch) => {
  dispatch(dialogPreferencesLockOpen());
};

export const formUpdate = changes => dispatch => dispatch(dialogPreferencesLockFormUpdate(changes));

export const checkCurrentPassword = () => (dispatch, getState) => {
  const state = getState();
  if (state.preferences.lockApp === state.dialogs.preferencesLock.form.currentPassword) {
    dispatch(close());
    dispatch(openDialogPreferences(true));
  } else {
    dispatch(dialogPreferencesLockFormUpdate({
      currentPasswordErr: STRING_INCORRECT_PASSWORD,
    }));
  }
};
