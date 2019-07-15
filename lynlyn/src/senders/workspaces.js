/* global ipcRenderer */

export const getWorkspace = index => ipcRenderer.sendSync('get-workspace', index);

export const getWorkspaces = () => ipcRenderer.sendSync('get-workspaces');

export const requestSetWorkspace = (index, value) => ipcRenderer.send('request-set-workspace', index, value);

export const requestAddWorkspace = value => ipcRenderer.send('request-add-workspace', value);

export const requestRemoveWorkspace = index => ipcRenderer.send('request-remove-workspace', index);
