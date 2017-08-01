/* global ipcRenderer */

const uninstallAppAsync = (id, name) =>
  new Promise((resolve, reject) => {
    try {
      const listener = (e, receivedId, receivedStatus) => {
        if (id === receivedId && receivedStatus === null) {
          resolve();

          ipcRenderer.removeListener('set-managed-app', listener);
        }
      };

      ipcRenderer.on('set-managed-app', listener);

      ipcRenderer.send('uninstall-app', id, name);
    } catch (err) {
      reject(err);
    }
  });

export default uninstallAppAsync;
