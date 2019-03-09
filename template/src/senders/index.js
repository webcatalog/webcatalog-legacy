
const { ipcRenderer } = window.require('electron');

export const requestOpenInBrowser = url => ipcRenderer.send('request-open-in-browser', url);

export const requestLoadURL = (url, id) => ipcRenderer.send('request-load-url', url, id);

export const requestShowPreferencesWindow = () => ipcRenderer.send('request-show-preferences-window');
export const requestShowEditWorkspaceWindow = id => ipcRenderer.send('request-show-edit-workspace-window', id);
export const requestShowCodeInjectionWindow = type => ipcRenderer.send('request-show-code-injection-window', type);

// Preferences
export const getPreference = name => ipcRenderer.sendSync('get-preference', name);
export const getPreferences = () => ipcRenderer.sendSync('get-preferences');
export const requestSetPreference = (name, value) => ipcRenderer.send('request-set-preference', name, value);
export const requestResetPreferences = () => ipcRenderer.send('request-reset-preferences');
export const requestShowRequireRestartDialog = () => ipcRenderer.send('request-show-require-restart-dialog');

// System Preferences
export const getSystemPreference = name => ipcRenderer.sendSync('get-system-preference', name);
export const getSystemPreferences = () => ipcRenderer.sendSync('get-system-preferences');
export const requestSetSystemPreference = (name, value) => ipcRenderer.send('request-set-system-preference', name, value);

// Workspace
export const getWorkspace = id => ipcRenderer.sendSync('get-workspace', id);
export const getWorkspaces = () => ipcRenderer.sendSync('get-workspaces');
export const requestCreateWorkspace = () => ipcRenderer.send('request-create-workspace');
export const requestSetWorkspace = (id, opts) => ipcRenderer.send('request-set-workspace', id, opts);
export const requestSetActiveWorkspace = id => ipcRenderer.send('request-set-active-workspace', id);
export const requestRemoveWorkspace = id => ipcRenderer.send('request-remove-workspace', id);
export const requestClearBrowsingData = () => ipcRenderer.send('request-clear-browsing-data');

// Find In Page
export const requestFindInPage = (text, forward) => ipcRenderer.send('request-find-in-page', text, forward);
export const requestStopFindInPage = close => ipcRenderer.send('request-stop-find-in-page', close);
