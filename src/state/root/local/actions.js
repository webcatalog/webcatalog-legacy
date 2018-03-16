import {
  localAppSet,
  localAppRemove,
} from './action-creators';

import { openSnackbar } from '../snackbar/actions';

import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_INSTALL,
  STRING_FAILED_TO_UPDATE,
  STRING_NAME_EXISTS,
} from '../../../constants/strings';

import {
  isUpdatable,
  nameExists,
} from './utils';


export const setLocalApp = (id, status, app) =>
  dispatch => dispatch(localAppSet(id, status, app));

export const removeLocalApp = id =>
  dispatch => dispatch(localAppRemove(id));


export const installApp = app =>
  (dispatch, getState) => {
    const state = getState();

    if (nameExists(state, app.name)) {
      dispatch(openSnackbar(STRING_NAME_EXISTS.replace('{name}', app.name)));
      return null;
    }

    return installAppAsync(app)
      .catch((err) => {
        dispatch(openSnackbar(STRING_FAILED_TO_INSTALL.replace('{name}', app.name)));
        // eslint-disable-next-line
        console.log(err);
      });
  };

export const updateApp = id =>
  (dispatch, getState) => {
    const managedApp = getState().local.apps[id];

    if (managedApp.status !== 'INSTALLED') return null;

    dispatch(setLocalApp(id, 'INSTALLING', managedApp.app));

    return installAppAsync(managedApp.app)
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
