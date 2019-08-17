import semver from 'semver';

import { SET_APP, REMOVE_APP, CLEAN_APP_MANAGEMENT } from '../../constants/actions';

import {
  isNameExisted,
  getAppCount,
  getOutdatedAppsAsList,
} from './utils';

import packageJson from '../../../package.json';

import {
  requestShowMessageBox,
  requestInstallApp,
} from '../../senders';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

export const clean = () => ({
  type: CLEAN_APP_MANAGEMENT,
});

export const setApp = (id, app) => ({
  type: SET_APP,
  id,
  app,
});

export const removeApp = (id) => ({
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

  // download icon when updating apps in the catalog
  const iconUrl = id.startsWith('custom-') ? icon : `https://s3.getwebcatalog.com/apps/${id}/${id}-icon.png`;

  return requestInstallApp(id, name, url, iconUrl, mailtoHandler);
};

export const updateAllApps = () => (dispatch, getState) => {
  const state = getState();

  const { latestTemplateVersion } = state.general;

  if (semver.lt(packageJson.templateVersion, latestTemplateVersion)) {
    return requestShowMessageBox('WebCatalog is outdated. Please update WebCatalog first to continue.', 'error');
  }

  const outdatedApps = getOutdatedAppsAsList(state);

  outdatedApps.forEach((app) => {
    const {
      id, name, url, icon, mailtoHandler,
    } = app;

    // download icon when updating apps in the catalog
    const iconUrl = id.startsWith('custom-') ? icon : `https://s3.getwebcatalog.com/apps/${id}/${id}-icon.png`;

    return requestInstallApp(id, name, url, iconUrl, mailtoHandler);
  });

  return null;
};
