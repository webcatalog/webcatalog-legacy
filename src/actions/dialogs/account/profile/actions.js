import validate from '../../../../helpers/validate';
import hasErrors from '../../../../helpers/has-errors';

import { openSnackbar } from '../../../root/snackbar/actions';
import { getUser } from '../../../root/user/actions';

import {
  dialogAccountProfileFormUpdate,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

import { apiPatch } from '../../../api';

const getValidationRules = () => ({
  email: {
    fieldName: 'Email',
    email: true,
    required: true,
  },
});

export const formUpdate = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(dialogAccountProfileFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.account.profile.form;

    const validatedChanges = validate(changes, getValidationRules());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogAccountProfileSaveRequest());
    return dispatch(apiPatch('/user', changes))
      .then(() => {
        dispatch(dialogAccountProfileSaveSuccess());
        dispatch(openSnackbar('Your profile has been saved!'));
        dispatch(getUser());
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your profile information.')));
  };
