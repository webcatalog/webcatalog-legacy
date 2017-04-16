import { remote } from 'electron';
import Immutable from 'immutable';

import { SET_MANAGED_APP, REMOVE_MANAGED_APP } from '../constants/actions';
import { INSTALLING, UNINSTALLING, INSTALLED, UPDATING } from '../constants/statuses';

import scanInstalledAsync from '../helpers/scanInstalledAsync';
import installAppAsync from '../helpers/installAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';
import updateAppAsync from '../helpers/updateAppAsync';

export const installApp = app => (dispatch) => {
  dispatch({
    type: SET_MANAGED_APP,
    app: app.set('status', INSTALLING),
  });

  installAppAsync({
    appId: app.get('id'),
    appName: app.get('name'),
    appUrl: app.get('url'),
  })
  .then(() => {
    dispatch({
      type: SET_MANAGED_APP,
      app: app.set('status', INSTALLED).set('version', remote.app.getVersion()),
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch({
      type: REMOVE_MANAGED_APP,
      id: app.get('id'),
    });
  });
};

export const updateApp = app => (dispatch) => {
  dispatch({
    type: SET_MANAGED_APP,
    app: app.set('status', UPDATING),
  });

  updateAppAsync({
    appId: app.get('id'),
    appName: app.get('name'),
    appUrl: app.get('url'),
  })
  .then(() => {
    dispatch({
      type: SET_MANAGED_APP,
      app: app.set('status', INSTALLED).set('version', remote.app.getVersion()),
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch({
      type: SET_MANAGED_APP,
      app: app.set('status', INSTALLED).set('version', app.get('version')),
    });
  });
};


export const uninstallApp = app => ((dispatch) => {
  dispatch({
    type: SET_MANAGED_APP,
    app: app.set('status', UNINSTALLING),
  });

  uninstallAppAsync({
    appId: app.get('id'),
    appName: app.get('name'),
    shouldClearStorageData: true,
  })
  .then(() => {
    dispatch({
      type: REMOVE_MANAGED_APP,
      id: app.get('id'),
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch({
      type: SET_MANAGED_APP,
      app: app.set('status', INSTALLED).set('version', remote.app.getVersion()),
    });
  });
});


export const scanInstalledApps = () => ((dispatch) => {
  scanInstalledAsync()
    .then((installedApps) => {
      installedApps.forEach((app) => {
        dispatch({
          type: SET_MANAGED_APP,
          app: Immutable.Map(app).set('status', INSTALLED),
        });
      });
    });
});
