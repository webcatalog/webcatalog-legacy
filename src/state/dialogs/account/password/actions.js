import { openSnackbar } from '../../../main/snackbar/actions';

import { apiPatch } from '../../../api';

import {
  dialogAccountPasswordFormUpdate,
  dialogAccountPasswordSaveRequest,
  dialogAccountPasswordSaveSuccess,
} from './action-creators';

const hasErrors = (validatedChanges) => {
  if (validatedChanges.currentPasswordError
    || validatedChanges.passwordError || validatedChanges.confirmPasswordError) {
    return true;
  }
  return false;
};

const validate = (changes, state) => {
  const {
    currentPassword,
    password,
    confirmPassword,
  } = changes;

  const {
    password: statePassword,
    confirmPassword: stateConfirmPassword,
  } = state.dialogs.account.password.form;

  const newChanges = changes;

  if (currentPassword || currentPassword === '') {
    const key = currentPassword;
    if (key.length === 0) newChanges.currentPasswordError = 'Enter your current password';
    else if (key.length < 6) newChanges.currentPasswordError = 'Must be at least 6 characters';
    else newChanges.currentPasswordError = null;
  }

  if (password || password === '') {
    const key = password;
    if (key.length === 0) newChanges.passwordError = 'Enter a new password';
    else if (key.length < 6) newChanges.passwordError = 'Must be at least 6 characters';
    else if (stateConfirmPassword !== '' && key !== stateConfirmPassword) newChanges.passwordError = 'Confirm password must match';
    else newChanges.passwordError = null;
  }

  if (confirmPassword || confirmPassword === '') {
    const key = confirmPassword;
    if (key.length === 0) newChanges.confirmPasswordError = 'Confirm your new password';
    else if (key.length < 6) newChanges.confirmPasswordError = 'Must be at least 6 characters';
    else if (statePassword !== '' && key !== statePassword) newChanges.passwordError = 'Password must match';
    else newChanges.confirmPasswordError = null;
  }

  return newChanges;
};

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getState());
    dispatch(dialogAccountPasswordFormUpdate(validatedChanges));
  };

export const save = () =>
  (dispatch, getState) => {
    const changes = getState().dialogs.account.password.form;

    const validatedChanges = validate(changes, getState());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    const newChanges = {
      currentPassword: changes.currentPassword,
      password: changes.password,
    };

    dispatch(dialogAccountPasswordSaveRequest());
    return dispatch(apiPatch('/user/password', newChanges))
      .then(res => res.json())
      .then(() => {
        dispatch(dialogAccountPasswordSaveSuccess());
        dispatch(openSnackbar('Your password has been updated!'));
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your password.')));
  };
