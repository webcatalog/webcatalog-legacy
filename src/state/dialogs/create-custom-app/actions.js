import path from 'path';

import {
  createCustomAppClose,
  createCustomAppCreateFailed,
  createCustomAppCreateRequest,
  createCustomAppCreateSuccess,
  createCustomAppFormUpdate,
  createCustomAppOpen,
} from './action-creators';

import validate from '../../../helpers/validate';
import hasErrors from '../../../helpers/has-errors';
import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_INSTALL,
  STRING_INSTALL_SUCCESSFULLY,
  STRING_NAME_EXISTS,
  STRING_NAME,
  STRING_URL,
} from '../../../constants/strings';

import { openSnackbar } from '../../root/snackbar/actions';

import {
  nameExists,
} from '../../root/local/utils';

export const close = () =>
  dispatch => dispatch(createCustomAppClose());

export const open = () =>
  dispatch => dispatch(createCustomAppOpen());

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

    const form = state.dialogs.createCustomApp.form;

    const validatedChanges = validate(form, getValidationRules(getState()));
    if (hasErrors(validatedChanges)) {
      return dispatch(updateForm(validatedChanges));
    }

    const app = {
      id: Date.now().toString(),
      name: form.name,
      url: form.url,
      icon: form.icon || path.join(window.appPath, 'electron-icon.png'),
    };

    if (nameExists(state, app.name)) {
      dispatch(openSnackbar(STRING_NAME_EXISTS.replace('{name}', app.name)));
      return null;
    }

    dispatch(createCustomAppCreateRequest());
    return installAppAsync(app)
      .then(() => {
        dispatch(createCustomAppCreateSuccess());
        dispatch(close());
        dispatch(openSnackbar(STRING_INSTALL_SUCCESSFULLY.replace('{name}', form.name)));
      })
      .catch(() => {
        dispatch(createCustomAppCreateFailed());
        dispatch(openSnackbar(STRING_FAILED_TO_INSTALL.replace('{name}', form.name)));
      });
  };
