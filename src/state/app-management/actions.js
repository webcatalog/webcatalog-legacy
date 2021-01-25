/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import semver from 'semver';
import {
  SET_APP,
  REMOVE_APP,
  CLEAN_APP_MANAGEMENT,
  SET_SCANNING_FOR_INSTALLED,
  SORT_APPS,
} from '../../constants/actions';
import { open as openDialogLicenseRegistration } from '../dialog-license-registration/actions';

import swiftype from '../../swiftype';

import {
  isNameExisted,
  getOutdatedAppsAsList,
  getTotalAppCount,
} from './utils';

import {
  requestShowMessageBox,
  requestInstallApp,
  requestUpdateApp,
} from '../../senders';

export const clean = () => (dispatch, getState) => {
  const state = getState();
  const { apps } = state.appManagement;

  dispatch({
    type: CLEAN_APP_MANAGEMENT,
    apps,
  });
};

export const setApp = (id, app) => (dispatch, getState) => {
  const state = getState();
  const { sortInstalledAppBy } = state.preferences;
  const { apps } = state.appManagement;
  const { activeQuery } = state.installed || '';

  dispatch({
    type: SET_APP,
    id,
    app,
    apps,
    sortInstalledAppBy,
    activeQuery,
  });
};

export const removeApp = (id) => ({
  type: REMOVE_APP,
  id,
});

export const installApp = (engine, id, name, url, icon, opts) => (dispatch, getState) => {
  const state = getState();

  const totalAppCount = getTotalAppCount(state);
  const { registered } = state.preferences;
  console.log(state.preferences);
  if (totalAppCount >= 10 && !registered) {
    dispatch(openDialogLicenseRegistration());
  }

  const sanitizedName = name.trim();
  if (isNameExisted(sanitizedName, state)) {
    requestShowMessageBox(`An app named ${sanitizedName} already exists.`, 'error');
    return null;
  }

  requestInstallApp(engine, id, sanitizedName, url, icon, opts);
  return null;
};

export const updateApp = (id, _name, _url, _icon, _opts) => async (dispatch, getState) => {
  // on Linux
  // opts.category is needed for WebCatalog to set correct freedesktop.org categories
  // but prior to v27.x, "opts.category" value is not included in app.json
  // so we try to get from the server
  const appObj = getState().appManagement.apps[id];
  const { engine, version } = appObj;
  const name = _name || appObj.name;
  const url = _url !== undefined ? _url : appObj.url; // url can be null
  const icon = _icon || appObj.icon;
  const opts = { ...appObj.opts, ..._opts };

  // force using default Electron user data path for apps upgraded from WebCatalog Engine < 14.x
  // for backward compatibility
  if (engine === 'electron' && semver.lt(version, '14.0.0')) {
    opts.legacyUserData = true;
  }

  if (window.process.platform === 'linux'
    && !id.startsWith('custom-')
    && opts.category == null) {
    await swiftype
      .search('', {
        filters: {
          id: [id],
        },
        result_fields: {
          category: { raw: {} },
        },
      })
      .then((res) => {
        const app = res.rawResults[0];
        opts.category = app.category.raw;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }

  requestUpdateApp(engine, id, name, url, icon, opts);
};

export const updateApps = (apps) => (dispatch) => {
  apps.forEach((app) => dispatch(updateApp(app.id)));
};

export const updateAllApps = () => (dispatch, getState) => {
  const state = getState();

  const outdatedApps = getOutdatedAppsAsList(state);

  outdatedApps.forEach((app) => dispatch(updateApp(app.id)));

  return null;
};

export const setScanningForInstalled = (scanning) => ({
  type: SET_SCANNING_FOR_INSTALLED,
  scanning,
});

export const sortApps = () => (dispatch, getState) => {
  const state = getState();
  const { sortInstalledAppBy } = state.preferences;
  const { apps } = state.appManagement;

  dispatch({
    type: SORT_APPS,
    apps,
    sortInstalledAppBy,
  });
};
