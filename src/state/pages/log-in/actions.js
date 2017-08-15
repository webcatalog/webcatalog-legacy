/* global ipcRenderer */
import validate from '../../../utils/validate';
import hasErrors from '../../../utils/has-errors';

import { openSnackbar } from '../../root/snackbar/actions';

import {
  logInFormUpdate,
  logInSubmitRequest,
  logInSubmitSuccess,
  logInSubmitFailed,
} from './action-creators';

import { apiPost } from '../../api';

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
      dispatch(logInSubmitRequest());
      dispatch(apiPost('/auth', form))
        .then(({ jwt }) => {
          dispatch(logInSubmitSuccess());
          ipcRenderer.send('write-token-to-disk', jwt);
        })
        .catch((err) => {
          dispatch(logInSubmitFailed());
          // If fetchedResponse exists,
          // it means the request went through but the server returned error code.
          if (err.fetchedResponse) {
            const code = err.fetchedResponse.error.code;
            switch (code) {
              case 'UserNotFound': {
                dispatch(openSnackbar('The email you entered doesn\'t exist in our database.'));
                break;
              }
              case 'NoPassword': {
                dispatch(openSnackbar('You haven\'t set your account password. Please sign in with Google or reset your password.'));
                break;
              }
              case 'WrongPassword':
              default: {
                dispatch(openSnackbar('The password you entered is not correct.'));
              }
            }
          } else {
            dispatch(openSnackbar('WebCatalog is having trouble connecting to our server.'));
          }
        });
    }
  };
