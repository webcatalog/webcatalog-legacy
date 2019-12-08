const { session } = require('electron');

const {
  countWorkspaces,
  createWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspaces,
  removeWorkspace,
  setActiveWorkspace,
  setWorkspace,
} = require('./workspaces');

const {
  addView,
  setActiveView,
  removeView,
  setViewsAudioPref,
  setViewsNotificationsPref,
} = require('./views');

const mainWindow = require('../windows/main');

const createWorkspaceView = () => {
  const newWorkspace = createWorkspace();
  setActiveWorkspace(newWorkspace.id);

  addView(mainWindow.get(), getWorkspace(newWorkspace.id));
  setActiveView(mainWindow.get(), newWorkspace.id);
};

const setWorkspaceView = (id, opts) => {
  setWorkspace(id, opts);
  setViewsAudioPref();
  setViewsNotificationsPref();
};

const setActiveWorkspaceView = (id) => {
  setActiveWorkspace(id);
  setActiveView(mainWindow.get(), id);
};

const removeWorkspaceView = (id) => {
  if (countWorkspaces() === 1) {
    createWorkspaceView();
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
};

module.exports = {
  clearBrowsingData,
  createWorkspaceView,
  loadURL,
  removeWorkspaceView,
  setActiveWorkspaceView,
  setWorkspaceView,
};
