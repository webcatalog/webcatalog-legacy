import {
  LOCKER_UNLOCK,
  LOCKER_LOCK,
  LOCKER_FORM_UPDATE,
} from '../../../constants/actions';

import { STRING_INCORRECT_PASSWORD } from '../../../constants/strings';

export const unlock = () => ({ type: LOCKER_UNLOCK });
export const lock = () => ({ type: LOCKER_LOCK });

export const formUpdate = changes => ({
  type: LOCKER_FORM_UPDATE,
  changes,
});

export const checkPassword = () => (dispatch, getState) => {
  const state = getState();
  if (state.preferences.lockApp === state.locker.form.password) {
    dispatch(unlock());
  } else {
    dispatch(formUpdate({
      passwordErr: STRING_INCORRECT_PASSWORD,
    }));
  }
};
