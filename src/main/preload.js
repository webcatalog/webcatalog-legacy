const { ipcRenderer } = require('electron');

window.onload = () => {
  // inject JS
  ipcRenderer.once('shell-info', (e, shellInfo) => {
    window.shellInfo = shellInfo;

    document.title = shellInfo.name;

    const injectedJS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedJS`, null);
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

    const injectedCSS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedCSS`, null);
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

  ipcRenderer.send('get-shell-info');
};
