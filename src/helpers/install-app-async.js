/* global ipcRenderer */
import { INSTALLED } from '../constants/app-statuses';

const installAppAsync = appObj =>
  new Promise((resolve, reject) => {
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

      ipcRenderer.send('install-app', appObj);
    } catch (err) {
      reject(err);
    }
  });

export default installAppAsync;
