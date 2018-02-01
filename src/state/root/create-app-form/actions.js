import path from 'path';

import {
  createCustomAppCreateFailed,
  createCustomAppCreateRequest,
  createCustomAppCreateSuccess,
  createCustomAppFormUpdate,
} from './action-creators';

import validate from '../../../helpers/validate';
import hasErrors from '../../../helpers/has-errors';
import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_CREATE,
  STRING_CREATE_SUCCESSFULLY,
  STRING_NAME,
  STRING_URL,
} from '../../../constants/strings';

import { openSnackbar } from '../../root/snackbar/actions';

const getValidationRules = () => ({
  name: {
    fieldName: STRING_NAME,
    required: true,
  },
  url: {
    fieldName: STRING_URL,
    required: true,
    url: true,
  },
});

export const updateForm = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(createCustomAppFormUpdate(validatedChanges));
  };

export const create = () =>
  (dispatch, getState) => {
    const state = getState();

    const form = state.createAppForm.form;

    const validatedChanges = validate(form, getValidationRules(getState()));
    if (hasErrors(validatedChanges)) {
      return dispatch(updateForm(validatedChanges));
    }

    const app = {
      id: `custom-${Date.now().toString()}`,
      name: form.name,
      url: form.url,
      icon: form.icon || path.join(window.appPath, 'electron-icon.png'),
      location: form.location,
    };

    dispatch(createCustomAppCreateRequest());
    return installAppAsync(app)
      .then(() => {
        dispatch(createCustomAppCreateSuccess());
        dispatch(openSnackbar(STRING_CREATE_SUCCESSFULLY.replace('{name}', form.name)));
      })
      .catch(() => {
        dispatch(createCustomAppCreateFailed());
        dispatch(openSnackbar(STRING_FAILED_TO_CREATE.replace('{name}', form.name)));
      });
  };
