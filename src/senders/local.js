/* global ipcRenderer */

export const requestScanInstalledApps = () => ipcRenderer.send('request-scan-installed-apps');

export const requestOpenApp = (id, name) => ipcRenderer.send('request-open-app', id, name);

export const requestUninstallApp = (id, name) => ipcRenderer.send('request-uninstall-app', id, name);

export const requestInstallApp = (appObj, browser) => ipcRenderer.send('request-install-app', appObj, browser);
