import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogAccountPasswordFormUpdate,
  dialogAccountPasswordSaveRequest,
  dialogAccountPasswordSaveSuccess,
} from './action-creators';

import { patchUserPassword } from '../../../../user/actions';

export const formUpdate = changes =>
  dispatch => dispatch(dialogAccountPasswordFormUpdate(changes));

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().ui.dialogs.account.password.form;
    const newChanges = {
      currentPassword: changes.currentPassword,
      password: changes.password,
    };
    dispatch(dialogAccountPasswordSaveRequest());
    return dispatch(patchUserPassword(newChanges))
      .then(() => {
        dispatch(dialogAccountPasswordSaveSuccess());
        dispatch(openSnackbar(
          'Your profile has been saved!',
          'Close',
        ));
      });
  };
