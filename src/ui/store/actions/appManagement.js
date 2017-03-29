import { SET_MANAGED_APP, REMOVE_MANAGED_APP } from '../constants/actions';
import { INSTALLING, UNINSTALLING, INSTALLED } from '../constants/statuses';

import scanInstalledAsync from '../helpers/scanInstalledAsync';
import installOfficialAppAsync from '../helpers/installOfficialAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';
import updateAppsAsync from '../helpers/updateAppsAsync';
import getAllAppPath from '../helpers/getAllAppPath';

export const installApp = app => (dispatch) => {
  dispatch({
    type: SET_MANAGED_APP,
    app: {
      status: INSTALLING,
      id: app.get('id'),
      name: app.get('name'),
      url: app.get('url'),
    },
  });

  installOfficialAppAsync({
    allAppPath: getAllAppPath(),
    appId: app.get('id'),
    appName: app.get('name'),
    appUrl: app.get('url'),
  })
  .then(() => {
    dispatch({
      type: SET_MANAGED_APP,
      app: {
        status: INSTALLED,
        id: app.get('id'),
        name: app.get('name'),
        url: app.get('url'),
      },
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


export const uninstallApp = app => ((dispatch) => {
  dispatch({
    type: SET_MANAGED_APP,
    app: {
      status: UNINSTALLING,
      id: app.get('id'),
      name: app.get('name'),
      url: app.get('url'),
    },
  });

  uninstallAppAsync({
    allAppPath: getAllAppPath(),
    appId: app.get('id'),
    appName: app.get('name'),
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
      app: {
        status: INSTALLED,
        id: app.get('id'),
        name: app.get('name'),
        url: app.get('url'),
      },
    });
  });
});


export const scanInstalledApps = () => ((dispatch) => {
  scanInstalledAsync({
    allAppPath: getAllAppPath(),
  })
    .then((installedApps) => {
      // update Apps
      updateAppsAsync({
        allAppPath: getAllAppPath(),
        installedApps,
      })
      .then(() => {
        /* eslint-disable no-console */
        console.log('Updating all apps successfully');
        /* eslint-enable no-console */
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */
      });

      installedApps.forEach((app) => {
        dispatch({
          type: SET_MANAGED_APP,
          app: {
            status: INSTALLED,
            id: app.id,
            name: app.name,
            url: app.url,
          },
        });
      });
    });
});
