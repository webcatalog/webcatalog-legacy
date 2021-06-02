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
import { INSTALLING, INSTALLED } from '../../constants/app-statuses';
import { ROUTE_INSTALLED } from '../../constants/routes';

import appSearch from '../../app-search';

import { open as openDialogLicenseRegistration } from '../dialog-license-registration/actions';
import { changeRoute } from '../router/actions';

import {
  isNameExisted,
  getOutdatedAppsAsList,
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

export const installApp = (id, name, url, icon, opts) => (dispatch, getState) => {
  const state = getState();

  // free version can only install up to 10 apps
  const { registered } = state.preferences;
  if (!registered) {
    const { apps, sortedAppIds } = state.appManagement;
    const appCount = sortedAppIds
      .filter((appId) => {
        const app = apps[appId];
        return app.status === INSTALLED || app.status === INSTALLING;
      }).length;
    if (appCount >= 10) {
      dispatch(openDialogLicenseRegistration());
      return null;
    }
  }

  const sanitizedName = name.trim();
  if (isNameExisted(sanitizedName, state)) {
    requestShowMessageBox(`An app named ${sanitizedName} already exists.`, 'error');
    return null;
  }

  requestInstallApp(id, sanitizedName, url, icon, opts);

  // if user is trying to install a custom app/space, move to "Updates"/installed tab automatically
  if (id.startsWith('custom-')) {
    dispatch(changeRoute(ROUTE_INSTALLED));
  }

  return null;
};

export const updateApp = (id, _name, _url, _icon, _opts) => async (dispatch, getState) => {
  // on Linux
  // opts.category is needed for WebCatalog to set correct freedesktop.org categories
  // but prior to v27.x, "opts.category" value is not included in app.json
  // so we try to get from the server
  const appObj = getState().appManagement.apps[id];
  const { version } = appObj;
  const name = _name || appObj.name;
  const url = _url !== undefined ? _url : appObj.url; // url can be null
  const icon = _icon || appObj.icon;
  const opts = { ...appObj.opts, ..._opts };

  // force using default Electron user data path for apps upgraded from Neutron < 14.x
  // for backward compatibility
  if (semver.lt(version, '14.0.0')) {
    opts.legacyUserData = true;
  }

  if (window.process.platform === 'linux'
    && !id.startsWith('custom-')
    && opts.category == null) {
    await appSearch
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

  requestUpdateApp(id, name, url, icon, opts);
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
