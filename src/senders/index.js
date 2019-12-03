const { ipcRenderer } = window.require('electron');

export const requestOpenInBrowser = (url) => ipcRenderer.send('request-open-in-browser', url);
export const requestShowMessageBox = (message, type) => ipcRenderer.send('request-show-message-box', message, type);

// Preferences
export const getPreference = (name) => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
export const requestShowRequireRestartDialog = () => ipcRenderer.send('request-show-require-restart-dialog');
export const requestOpenInstallLocation = () => ipcRenderer.send('request-open-install-location');

// System Preferences
export const getSystemPreference = (name) => ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => ipcRenderer.send('request-set-system-preference', name, value);


// App Management
export const requestGetInstalledApps = () => ipcRenderer.send('request-get-installed-apps');
export const requestInstallApp = (engine, id, name, url, icon) => ipcRenderer.send('request-install-app', engine, id, name, url, icon);
export const requestUpdateApp = (engine, id, name, url, icon) => ipcRenderer.send('request-update-app', engine, id, name, url, icon);
export const requestUninstallApp = (id, name) => ipcRenderer.send('request-uninstall-app', id, name);
export const requestOpenApp = (id, name) => ipcRenderer.send('request-open-app', id, name);

// Native Theme
export const getShouldUseDarkColors = () => ipcRenderer.sendSync('get-should-use-dark-colors');
export const getThemeSource = () => ipcRenderer.sendSync('get-theme-source');
export const requestSetThemeSource = (val) => ipcRenderer.send('request-set-theme-source', val);
