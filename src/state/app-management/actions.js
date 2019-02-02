import semver from 'semver';

import { SET_APP, REMOVE_APP } from '../../constants/actions';

import {
  isNameExisted,
  getAppCount,
} from './utils';

import packageJson from '../../../package.json';

import {
  requestShowMessageBox,
  requestInstallApp,
} from '../../senders';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

export const setApp = (id, app) => ({
  type: SET_APP,
  id,
  app,
});

export const removeApp = id => ({
  type: REMOVE_APP,
  id,
});

export const installApp = (id, name, url, icon, mailtoHandler) => (dispatch, getState) => {
  const state = getState();

  const shouldAskForLicense = !state.preferences.registered && getAppCount(state) > 1;

  if (shouldAskForLicense) {
    dispatch(openDialogLicenseRegistration());
    return null;
  }

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  requestInstallApp(id, name, url, icon, mailtoHandler);
  return null;
};

export const updateApp = (id, name, url, icon, mailtoHandler) => (dispatch, getState) => {
  const state = getState();

  const { latestTemplateVersion } = state.general;

  if (semver.lt(packageJson.templateVersion, latestTemplateVersion)) {
    return requestShowMessageBox('WebCatalog is outdated. Please update WebCatalog first to continue.', 'error');
  }

  return requestInstallApp(id, name, url, icon, mailtoHandler);
};
