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

import { ROUTE_INSTALLED_APPS } from '../../../constants/routes';

import { openSnackbar } from '../../root/snackbar/actions';

import { changeRoute } from '../../root/router/actions';

import { open as openDialogActivate } from '../../dialogs/activate/actions';

import {
  nameExists,
  numberOfApps,
} from '../../root/local/utils';

export const close = () =>
  dispatch => dispatch(createCustomAppClose());

export const open = () => (dispatch, getState) => {
  const state = getState();

  const { activated } = state.general;

  if (numberOfApps(state) > 1 && !activated) {
    dispatch(openDialogActivate());
  } else {
    dispatch(createCustomAppOpen());
  }
};

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

    const { form } = state.dialogs.createCustomApp;
    const { browser } = state.preferences;

    const validatedChanges = validate(form, getValidationRules(getState()));
    if (hasErrors(validatedChanges)) {
      return dispatch(updateForm(validatedChanges));
    }

    const app = {
      id: `custom-${Date.now().toString()}`,
      name: form.name,
      url: form.url,
      icon: form.icon,
      category: form.category,
    };

    if (nameExists(state, app.name)) {
      dispatch(openSnackbar(STRING_NAME_EXISTS.replace('{name}', app.name)));
      return null;
    }

    dispatch(changeRoute(ROUTE_INSTALLED_APPS));
    dispatch(close());

    dispatch(createCustomAppCreateRequest());

    return installAppAsync(app, browser)
      .then(() => {
        dispatch(createCustomAppCreateSuccess());
        dispatch(openSnackbar(STRING_INSTALL_SUCCESSFULLY.replace('{name}', form.name)));
      })
      .catch(() => {
        dispatch(createCustomAppCreateFailed());
        dispatch(openSnackbar(STRING_FAILED_TO_INSTALL.replace('{name}', form.name)));
      });
  };
