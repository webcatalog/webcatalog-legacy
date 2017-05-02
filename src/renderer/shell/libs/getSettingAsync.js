import { ipcRenderer } from 'electron';

const getSettingAsync = (name, defaultVal) =>
  new Promise((resolve, reject) => {
    const listener = (e, receivedName, val) => {
      if (receivedName === name) {
        ipcRenderer.removeListener('settings', listener);

        resolve(val);
      }
    };

    ipcRenderer.on('setting', listener);

    ipcRenderer.send('get-setting', name, defaultVal);

    setTimeout(() => {
      reject(new Error('No response from main process after 10 seconds'));
    }, 10000); // 10 seconds
  });

export default getSettingAsync;
