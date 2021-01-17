/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  SET_APP,
  REMOVE_APP,
  CLEAN_APP_MANAGEMENT,
  SET_SCANNING_FOR_INSTALLED,
  SORT_APPS,
} from '../../constants/actions';

import swiftype from '../../swiftype';

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

export const installApp = (engine, id, name, url, icon, opts) => (dispatch, getState) => {
  const state = getState();

  const sanitizedName = name.trim();
  if (isNameExisted(sanitizedName, state)) {
    requestShowMessageBox(`An app named ${sanitizedName} already exists.`, 'error');
    return null;
  }

  requestInstallApp(engine, id, sanitizedName, url, icon, opts);
  return null;
};

export const updateApp = (engine, id, name, url, icon, _opts) => async () => {
  // on Linux
  // opts.category is needed for WebCatalog to set correct freedesktop.org categories
  // but prior to v27.x, "opts.category" value is not included in app.json
  // so we try to get from the server
  const opts = { ..._opts };

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
  apps.forEach((app) => {
    const {
      engine, id, name, url, icon,
    } = app;

    return dispatch(updateApp(engine, id, name, url, icon));
  });
};

export const updateAllApps = () => (dispatch, getState) => {
  const state = getState();

  const outdatedApps = getOutdatedAppsAsList(state);

  outdatedApps.forEach((app) => {
    const {
      engine, id, name, url, icon,
    } = app;

    return dispatch(updateApp(engine, id, name, url, icon));
  });

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
