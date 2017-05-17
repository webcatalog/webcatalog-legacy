const { ipcRenderer } = require('electron');

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

window.onload = () => {
  // inject JS
  ipcRenderer.once('shell-info', (e, shellInfo) => {
    window.shellInfo = shellInfo;

    document.title = shellInfo.name;

    getSettingAsync(`behaviors.${shellInfo.id}.injectedJS`, null)
      .then((injectedJS) => {
        if (!injectedJS || injectedJS.trim().length < 1) return;

        try {
          const node = document.createElement('script');
          node.innerHTML = injectedJS;
          document.body.appendChild(node);
        } catch (err) {
          /* eslint-disable no-console */
          console.log(err);
          /* eslint-enable no-console */
        }
      });

    getSettingAsync(`behaviors.${shellInfo.id}.injectedCSS`, null)
      .then((injectedCSS) => {
        // inject CSS
        if (!injectedCSS || injectedCSS.trim().length < 1) return;

        try {
          const node = document.createElement('style');
          node.innerHTML = injectedCSS;
          document.body.appendChild(node);
        } catch (err) {
          /* eslint-disable no-console */
          console.log(err);
          /* eslint-enable no-console */
        }
      });
  });

  ipcRenderer.send('get-shell-info');
};
