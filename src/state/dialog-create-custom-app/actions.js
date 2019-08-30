
import {
  DIALOG_CREATE_CUSTOM_APP_CLOSE,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_OPEN,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import { ROUTE_INSTALLED } from '../../constants/routes';

import { changeRoute } from '../router/actions';

import { installApp } from '../app-management/actions';
import {
  isNameExisted,
  getAppCount,
} from '../app-management/utils';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

import { requestShowMessageBox } from '../../senders';

const { remote } = window.require('electron');

export const close = () => ({
  type: DIALOG_CREATE_CUSTOM_APP_CLOSE,
});

export const open = () => (dispatch, getState) => {
  const state = getState();

  const shouldAskForLicense = !state.preferences.registered && getAppCount(state) > 1;

  if (shouldAskForLicense) {
    return dispatch(openDialogLicenseRegistration());
  }

  return dispatch({
    type: DIALOG_CREATE_CUSTOM_APP_OPEN,
  });
};

const getValidationRules = () => ({
  name: {
    fieldName: 'Name',
    required: true,
  },
  url: {
    fieldName: 'URL',
    required: true,
    url: true,
  },
});

export const updateForm = (changes) => ({
  type: DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  changes: validate(changes, getValidationRules()),
});

export const create = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogCreateCustomApp;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const id = `custom-${Date.now().toString()}`;
  const { name, url } = form;
  const icon = form.icon || remote.getGlobal('defaultIcon');

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(installApp(id, name, url, icon));

  dispatch(changeRoute(ROUTE_INSTALLED));
  dispatch(close());
  return null;
};
