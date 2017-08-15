/* global ipcRenderer */
import validate from '../../../utils/validate';
import hasErrors from '../../../utils/has-errors';

import {
  logInFormUpdate,
} from './action-creators';

const getValidationRules = () => ({
  email: {
    fieldName: 'Email',
    required: true,
    email: true,
  },
  password: {
    fieldName: 'Password',
    required: true,
    minLength: 6,
  },
});

export const formUpdate = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(logInFormUpdate(validatedChanges));
  };

export const submit = () =>
  (dispatch, getState) => {
    const form = getState().pages.logIn.form;

    const validatedForm = validate(form, getValidationRules());

    if (hasErrors(validatedForm)) {
      dispatch(logInFormUpdate(validatedForm));
    } else {
      const { email, password } = form;
      ipcRenderer.send('sign-in-with-password', email, password);
    }
  };
