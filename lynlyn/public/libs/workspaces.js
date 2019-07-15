const settings = require('electron-settings');

const sendMessageToWindow = require('./send-message-to-window');

// have version to easily reset preferences in the future
const v = '1.0.0';

const defaultWorkspaces = [];

const getWorkspaces = () => settings.get(`workspaces.${v}`, defaultWorkspaces);

const getWorkspace = (index) => {
  const workspaces = settings.get(`workspaces.${v}`, defaultWorkspaces);
  if (index < 0 && index >= workspaces.length) {
    return null;
  }
  return workspaces[index];
};

const setWorkspace = (index, value) => {
  const workspaces = settings.get(`workspaces.${v}`, defaultWorkspaces);
  if (index >= 0 && index < workspaces.length) {
    workspaces[index] = value;
    settings.set(`workspaces.${v}`, workspaces);
    sendMessageToWindow('set-workspace', index, value);
  }
};

const addWorkspace = (value) => {
  const workspaces = settings.get(`workspaces.${v}`, defaultWorkspaces);
  workspaces.push(value);
  settings.set(`workspaces.${v}`, workspaces);
  sendMessageToWindow('add-workspace', value);
};

const removeWorkspace = (index) => {
  const workspaces = settings.get(`workspaces.${v}`, defaultWorkspaces);
  workspaces.splice(index, 1);
  settings.set(`workspaces.${v}`, workspaces);
  sendMessageToWindow('remove-workspace', index);
};

module.exports = {
  addWorkspace,
  getWorkspace,
  getWorkspaces,
  setWorkspace,
  removeWorkspace,
};
