import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogAccountPasswordFormUpdate,
  dialogAccountPasswordSaveRequest,
  dialogAccountPasswordSaveSuccess,
} from './action-creators';

import { patchUserPassword } from '../../../../user/actions';

const validate = (changes) => {
  const {
    currentPassword,
    password,
    confirmPassword,
  } = changes;


  const newChanges = changes;

  if (currentPassword || currentPassword === '') {
    const key = currentPassword;
    if (key.length === 0) newChanges.currentPasswordError = 'Enter your current password';
    else if (key.length < 6) newChanges.currentPasswordError = 'Must be at least 6 characters';
  }

  if (password || password === '') {
    const key = password;
    if (key.length === 0) newChanges.passwordError = 'Enter a new password';
    else if (key.length < 6) newChanges.passwordError = 'Must be at least 6 characters';
  }

  if (confirmPassword || confirmPassword === '') {
    const key = confirmPassword;
    if (key.length === 0) newChanges.confirmPasswordError = 'Confirm your new password';
    else if (key.length < 6) newChanges.confirmPasswordError = 'Must be at least 6 characters';
  }

  if (newChanges.currentPasswordError
    || newChanges.passwordError || newChanges.confirmPasswordError) {
    return newChanges;
  }

  return {
    ...newChanges,
    currentPasswordError: null,
    passwordError: null,
    confirmPasswordError: null,
  };
};

export const formUpdate = changes =>
  (dispatch) => {
    const validateChanges = validate(changes);
    console.log('validateChanges:', validateChanges);
    dispatch(dialogAccountPasswordFormUpdate(validateChanges));
  };

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
