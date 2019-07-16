const { session } = require('electron');

const {
  createWorkspace,
  countWorkspaces,
  setActiveWorkspace,
  removeWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspaces,
} = require('./workspaces');

const {
  addView,
  setActiveView,
  removeView,
} = require('./views');

const mainWindow = require('../windows/main');

const createWorkspaceView = (serviceId) => {
  if (countWorkspaces() > 9) {
    return;
  }

  const newWorkspace = createWorkspace(serviceId);
  setActiveWorkspace(newWorkspace.id);

  addView(mainWindow.get(), newWorkspace);
  setActiveView(mainWindow.get(), newWorkspace.id);
};

const setActiveWorkspaceView = (id) => {
  setActiveWorkspace(id);
  setActiveView(mainWindow.get(), id);
};

const removeWorkspaceView = (id) => {
  if (countWorkspaces() < 3) {
    setActiveWorkspaceView('home');
  } else if (getWorkspace(id).active) {
    setActiveWorkspaceView(getPreviousWorkspace(id).id);
  }

  removeWorkspace(id);
  removeView(id);
};

const clearBrowsingData = () => {
  const workspaces = getWorkspaces();
  Object.keys(workspaces).forEach((id) => {
    session.fromPartition(`persist:${id}`).clearStorageData();
  });

  // shared session
  session.fromPartition('persist:shared').clearStorageData();
};

const loadURL = (url, id) => {
  if (id) {
    setActiveWorkspace(id);
    setActiveView(mainWindow.get(), id);
  }

  const v = mainWindow.get().getBrowserView();
  if (v) v.webContents.loadURL(url);
  console.log(url);
};

module.exports = {
  createWorkspaceView,
  setActiveWorkspaceView,
  removeWorkspaceView,
  clearBrowsingData,
  loadURL,
};
