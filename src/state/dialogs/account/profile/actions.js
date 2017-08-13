import { openSnackbar } from '../../../main/snackbar/actions';
import { getUser } from '../../../main/user/actions';

import isEmail from '../../../../utils/isEmail';

import {
  dialogAccountProfileFormUpdate,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

import { apiPatch } from '../../../api';

const hasErrors = (validatedChanges) => {
  if (validatedChanges.emailError) {
    return true;
  }
  return false;
};

const validate = (changes) => {
  const {
    email,
  } = changes;

  const newChanges = changes;

  if (email || email === '') {
    const key = email;
    if (key.length === 0) newChanges.emailError = 'Enter an email';
    else if (!isEmail(key)) newChanges.emailError = 'Enter a valid email';
    else newChanges.emailError = null;
  }

  return newChanges;
};

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getState());
    dispatch(dialogAccountProfileFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.account.profile.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogAccountProfileSaveRequest());
    return dispatch(apiPatch('/user', changes))
      .then(res => res.json())
      .then(() => {
        dispatch(dialogAccountProfileSaveSuccess());
        dispatch(openSnackbar('Your profile has been saved!'));
        dispatch(getUser());
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your profile information.')));
  };
