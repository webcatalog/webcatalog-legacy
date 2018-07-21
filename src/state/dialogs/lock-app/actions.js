import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogLockAppClose,
  dialogLockAppOpen,
  dialogLockAppFormUpdate,
  dialogLockAppModeUpdate,
} from './action-creators';

import {
  STRING_PASSWORD_NOT_LONG_ENOUGH,
  STRING_CONFIRM_PASSWORD_NOT_MATCH,
  STRING_INCORRECT_PASSWORD,
} from '../../../constants/strings';

export const close = () =>
  dispatch => dispatch(dialogLockAppClose());

export const modeUpdate = mode =>
  dispatch => dispatch(dialogLockAppModeUpdate(mode));

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogLockAppOpen());
    if (!getState().preferences.lockApp) {
      dispatch(dialogLockAppModeUpdate(1));
    }
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogLockAppFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { password, confirmPassword } = getState().dialogs.lockApp.form;

  if (!password || password.length < 1) {
    dispatch(dialogLockAppFormUpdate({
      passwordErr: STRING_PASSWORD_NOT_LONG_ENOUGH,
    }));
    return;
  }

  if (confirmPassword !== password) {
    dispatch(dialogLockAppFormUpdate({
      confirmPasswordErr: STRING_CONFIRM_PASSWORD_NOT_MATCH,
    }));
    return;
  }

  requestSetPreference('lockApp', password);
  dispatch(close());
  dispatch(openDialogRelaunch());
};

export const checkCurrentPassword = () => (dispatch, getState) => {
  const state = getState();
  if (state.preferences.lockApp === state.dialogs.lockApp.form.currentPassword) {
    dispatch(dialogLockAppModeUpdate(2));
  } else {
    dispatch(dialogLockAppFormUpdate({
      currentPasswordErr: STRING_INCORRECT_PASSWORD,
    }));
  }
};

export const turnPasswordOff = () => (dispatch) => {
  requestSetPreference('lockApp', null);
  dispatch(close());
};
