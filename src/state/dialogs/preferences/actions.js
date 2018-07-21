import {
  dialogPreferencesClose,
  dialogPreferencesOpen,
} from './action-creators';

import { open as openDialogPreferencesLock } from '../preferences-lock/actions';

export const close = () =>
  dispatch => dispatch(dialogPreferencesClose());

export const open = withoutPassword =>
  (dispatch, getState) => {
    const { lockApp, requireLockPref } = getState().preferences;
    if (!withoutPassword && lockApp && requireLockPref) {
      dispatch(openDialogPreferencesLock());
    } else {
      dispatch(dialogPreferencesOpen());
    }
  };
