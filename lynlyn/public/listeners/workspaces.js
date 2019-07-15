const { ipcMain } = require('electron');
const {
  addWorkspace,
  getWorkspace,
  getWorkspaces,
  setWorkspace,
  removeWorkspace,
} = require('../libs/workspaces');


const loadWorkspacesListeners = () => {
  ipcMain.on('get-workspace', (e, index) => {
    const val = getWorkspace(index);
    e.returnValue = val;
  });


  ipcMain.on('get-workspaces', (e) => {
    const workspaces = getWorkspaces();
    e.returnValue = workspaces;
  });

  ipcMain.on('request-set-workspace', (e, index, value) => {
    setWorkspace(index, value);
  });

  ipcMain.on('request-add-workspace', (e, value) => {
    addWorkspace(value);
  });

  ipcMain.on('request-remove-workspace', (e, index) => {
    removeWorkspace(index);
  });
};

module.exports = loadWorkspacesListeners;
