const settings = require('electron-settings');
const uuidv1 = require('uuid/v1');

const sendToAllWindows = require('../libs/send-to-all-windows');

const v = '1';

let workspaces;

const countWorkspaces = () => Object.keys(workspaces).length;

const getWorkspaces = () => {
  if (workspaces) return workspaces;

  if (!settings.get(`workspaces.${v}`, null)) {
    const defaultWorkspaces = {};
    defaultWorkspaces.home = {
      id: 'home',
      name: 'Add Workspace',
      order: 1000,
      active: true,
    };
    settings.set(`workspaces.${v}`, defaultWorkspaces);
  }

  workspaces = settings.get(`workspaces.${v}`);
  return workspaces;
};

const getWorkspace = id => workspaces[id];

const getPreviousWorkspace = (id) => {
  const c = countWorkspaces();
  const workspace = workspaces[id];
  const previousOrder = workspace.order - 1 > -1 ? workspace.order - 1 : c - 2;
  return Object.values(workspaces).find(w => w.order === previousOrder);
};

const getNextWorkspace = (id) => {
  const c = countWorkspaces();
  const workspace = workspaces[id];
  const previousOrder = workspace.order + 1 < c ? workspace.order + 1 : 0;
  return Object.values(workspaces).find(w => w.order === previousOrder);
};

const createWorkspace = (serviceId, active) => {
  const newId = uuidv1();

  const newWorkspace = {
    id: newId,
    name: '',
    order: Object.keys(workspaces).length - 1,
    active: Boolean(active),
    serviceId,
  };

  workspaces[newId] = newWorkspace;
  sendToAllWindows('set-workspace', newId, newWorkspace);
  settings.set(`workspaces.${v}.${newId}`, newWorkspace);

  return newWorkspace;
};

const getActiveWorkspace = () => Object.values(workspaces).find(workspace => workspace.active);

const setActiveWorkspace = (id) => {
  // deactive the current one
  const currentActiveWorkspace = Object.assign({}, getActiveWorkspace());
  currentActiveWorkspace.active = false;
  workspaces[currentActiveWorkspace.id] = currentActiveWorkspace;
  sendToAllWindows('set-workspace', currentActiveWorkspace.id, currentActiveWorkspace);
  settings.set(`workspaces.${v}.${currentActiveWorkspace.id}`, currentActiveWorkspace);

  // active new one
  const newActiveWorkspace = Object.assign({}, workspaces[id]);
  newActiveWorkspace.active = true;
  workspaces[id] = newActiveWorkspace;
  sendToAllWindows('set-workspace', id, newActiveWorkspace);
  settings.set(`workspaces.${v}.${id}`, newActiveWorkspace);
};

const setWorkspace = (id, opts) => {
  const workspace = Object.assign({}, workspaces[id], opts);
  workspaces[id] = workspace;
  sendToAllWindows('set-workspace', id, workspace);
  settings.set(`workspaces.${v}.${id}`, workspace);
};

const removeWorkspace = (id) => {
  const removedWorkspace = workspaces[id];

  Object.values(workspaces).forEach((workspace) => {
    if (workspace.order > removedWorkspace.order) {
      setWorkspace(workspace.id, {
        order: workspace.order - 1,
      });
    }
  });

  delete workspaces[id];
  sendToAllWindows('set-workspace', id, null);
  settings.delete(`workspaces.${v}.${id}`);
};

module.exports = {
  countWorkspaces,
  createWorkspace,
  getActiveWorkspace,
  getNextWorkspace,
  getPreviousWorkspace,
  getWorkspace,
  getWorkspaces,
  removeWorkspace,
  setActiveWorkspace,
  setWorkspace,
};
