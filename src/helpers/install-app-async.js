/* global ipcRenderer */

import { INSTALLED } from '../constants/app-statuses';
import { requestInstallApp } from '../senders/local';

const installAppAsync = (appObj, browser) => {
  if (!appObj || !appObj.name || !appObj.url) {
    return Promise.reject(new Error('Missing information.'));
  }

  return new Promise((resolve, reject) => {
    try {
      const listener = (e, receivedId, receivedStatus) => {
        if (appObj.id === receivedId) {
          if (receivedStatus === INSTALLED) {
            resolve();
            ipcRenderer.removeListener('set-local-app', listener);
          }

          if (receivedStatus === null) {
            reject(new Error('Installing failed.'));
            ipcRenderer.removeListener('set-local-app', listener);
          }
        }
      };

      ipcRenderer.on('set-local-app', listener);

      requestInstallApp(appObj, browser);
    } catch (err) {
      reject(err);
    }
  });
};

export default installAppAsync;
