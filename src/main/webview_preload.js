const { ipcRenderer, remote } = require('electron');

window.global = {};
window.ipcRenderer = ipcRenderer;

window.onload = () => {
  // inject JS
  const shellInfo = ipcRenderer.sendSync('get-shell-info');

  document.title = shellInfo.name;

  // Inspect element
  // Importing this adds a right-click menu with 'Inspect Element' option
  let rightClickPosition = null;

  const { Menu, MenuItem } = remote;
  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'Back',
    click: () => {
      remote.getCurrentWindow().send('go-back');
    },
  }));
  menu.append(new MenuItem({
    label: 'Forward',
    click: () => {
      remote.getCurrentWindow().send('go-forward');
    },
  }));
  menu.append(new MenuItem({
    label: 'Reload',
    click: () => {
      remote.getCurrentWindow().send('reload');
    },
  }));
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: () => {
      const { webContents } = remote;
      webContents.getFocusedWebContents().inspectElement(rightClickPosition.x, rightClickPosition.y);
    },
  }));

  window.oncontextmenu = (e) => {
    e.preventDefault();
    rightClickPosition = { x: e.x, y: e.y };
    menu.popup(remote.getCurrentWindow());
  };

  const injectedJS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedJS`, null);
  if (injectedJS && injectedJS.trim().length > 0) {
    try {
      const node = document.createElement('script');
      node.innerHTML = injectedJS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }

  const injectedCSS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedCSS`, null);
  if (injectedCSS && injectedCSS.trim().length > 0) {
    try {
      const node = document.createElement('style');
      node.innerHTML = injectedCSS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }
};
