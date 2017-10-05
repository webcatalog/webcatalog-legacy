import semver from 'semver';

import {
  localAppSet,
  localAppRemove,
} from './action-creators';

import { openSnackbar } from '../snackbar/actions';
import { open as openUpdateMainAppFirstDialog } from '../../dialogs/update-main-app-first/actions';

import { apiGet } from '../../api';
import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_INSTALL,
  STRING_FAILED_TO_UPDATE,
} from '../../../constants/strings';


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

export const updateApp = (id, name) =>
  (dispatch, getState) => {
    const managedApp = getState().local.apps[id].app;

    return Promise.resolve()
      .then(() => {
        dispatch(setLocalApp(id, 'INSTALLING', managedApp));

        return dispatch(apiGet('/version/latest'));
      })
      .then(({ version }) => {
        const latestVersion = version;
        const localVersion = window.version;
        if (semver.gt(latestVersion, localVersion)) {
          dispatch(setLocalApp(id, 'INSTALLED', managedApp));
          return dispatch(openUpdateMainAppFirstDialog());
        }

        return dispatch(apiGet(`/apps/${id}?action=install`))
          .then(({ app }) => installAppAsync(app));
      })
      .catch((err) => {
        dispatch(setLocalApp(id, 'INSTALLED', managedApp));
        dispatch(openSnackbar(STRING_FAILED_TO_UPDATE.replace('{name}', name)));
        // eslint-disable-next-line
        console.log(err);
      });
  };
