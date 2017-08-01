import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogAccountProfileFormUpdate,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

import { patchUser } from '../../../../user/actions';

export const formUpdate = changes =>
  dispatch => dispatch(dialogAccountProfileFormUpdate(changes));

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().ui.dialogs.account.profile.form;
    dispatch(dialogAccountProfileSaveRequest());
    return dispatch(patchUser(changes))
      .then(() => {
        dispatch(dialogAccountProfileSaveSuccess());
        dispatch(openSnackbar(
          'Your profile has been saved!',
          'Close',
        ));
      });
  };
