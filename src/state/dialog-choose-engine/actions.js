
import {
  DIALOG_CHOOSE_ENGINE_CLOSE,
  DIALOG_CHOOSE_ENGINE_FORM_UPDATE,
  DIALOG_CHOOSE_ENGINE_OPEN,
} from '../../constants/actions';

import { installApp } from '../app-management/actions';
import {
  isNameExisted,
  getAppCount,
} from '../app-management/utils';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

import { requestShowMessageBox, getPreference } from '../../senders';

export const close = () => ({
  type: DIALOG_CHOOSE_ENGINE_CLOSE,
});

export const updateForm = (changes) => ({
  type: DIALOG_CHOOSE_ENGINE_FORM_UPDATE,
  changes,
});

export const create = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogChooseEngine;

  const {
    engine, id, icon, name, url, mailtoHandler,
  } = form;

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(installApp(engine, id, name, url, icon, mailtoHandler));

  dispatch(close());
  return null;
};

export const open = (id, name, url, icon, mailtoHandler) => (dispatch, getState) => {
  const state = getState();

  const shouldAskForLicense = !state.preferences.registered && getAppCount(state) > 1;

  if (shouldAskForLicense) {
    return dispatch(openDialogLicenseRegistration());
  }

  const { hideEnginePrompt } = state.preferences;
  if (hideEnginePrompt) {
    dispatch(updateForm({
      engine: getPreference('preferredEngine'),
      icon,
      id,
      mailtoHandler,
      name,
      url,
    }));

    return dispatch(create());
  }

  return dispatch({
    type: DIALOG_CHOOSE_ENGINE_OPEN,
    engine: getPreference('preferredEngine'),
    icon,
    id,
    mailtoHandler,
    name,
    url,
  });
};
