import isEmail from '../../../../utils/isEmail';

import {
  dialogAccountProfileFormUpdate,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

import { patchUser } from '../../../user/actions';

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
    return dispatch(patchUser(changes))
      .then(() => dispatch(dialogAccountProfileSaveSuccess()));
  };
