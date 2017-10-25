import semver from 'semver';

import {
  localAppSet,
  localAppRemove,
} from './action-creators';

import { openSnackbar } from '../snackbar/actions';
import { open as openUpdateMainAppFirstDialog } from '../../dialogs/update-main-app-first/actions';

import { apiGet } from '../../api';
import { getVersion } from '../../root/version/actions';

import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_INSTALL,
  STRING_FAILED_TO_UPDATE,
} from '../../../constants/strings';

import {
  isUpdatable,
} from './utils';


export const setLocalApp = (id, status, app) =>
  dispatch => dispatch(localAppSet(id, status, app));

export const removeLocalApp = id =>
  dispatch => dispatch(localAppRemove(id));


export const installApp = (id, name) =>
  dispatch =>
    dispatch(apiGet(`/apps/${id}?action=install`))
      .then(({ app }) => installAppAsync(app))
      .catch((err) => {
        dispatch(openSnackbar(STRING_FAILED_TO_INSTALL.replace('{name}', name)));
        // eslint-disable-next-line
        console.log(err);
      });

export const updateApp = id =>
  (dispatch, getState) => {
    const managedApp = getState().local.apps[id];

    if (managedApp.status !== 'INSTALLED') return null;

    return Promise.resolve()
      .then(() => {
        dispatch(setLocalApp(id, 'INSTALLING', managedApp.app));

        return dispatch(getVersion());
      })
      .then(() => {
        const latestVersion = getState().version.apiData.version;
        const localVersion = window.version;
        if (semver.gt(latestVersion, localVersion)) {
          dispatch(setLocalApp(id, 'INSTALLED', managedApp.app));
          return dispatch(openUpdateMainAppFirstDialog());
        }

        return dispatch(apiGet(`/apps/${id}?action=install`))
          .then(({ app }) => installAppAsync(app));
      })
      .catch((err) => {
        dispatch(setLocalApp(id, 'INSTALLED', managedApp.app));
        dispatch(openSnackbar(STRING_FAILED_TO_UPDATE.replace('{name}', managedApp.app.name)));
        // eslint-disable-next-line
        console.log(err);
      });
  };

export const updateAllApps = () =>
  (dispatch, getState) => {
    const state = getState();
    const managedApps = state.local.apps;

    Object.keys(managedApps).forEach((id) => {
      if (isUpdatable(state, id)) {
        dispatch(updateApp(id));
      }
    });
  };
