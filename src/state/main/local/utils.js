import {
  INSTALLED,
  UNINSTALLING,
  INSTALLING,
} from '../../../constants/app-statuses';

export const isUninstalling = (state, id) => {
  const managedApp = state.local.apps[id];
  if (managedApp && managedApp.status === UNINSTALLING) return true;
  return false;
};

export const isInstalling = (state, id) => {
  const managedApp = state.local.apps[id];
  if (managedApp && managedApp.status === INSTALLING) return true;
  return false;
};

export const isInstalled = (state, id) => {
  const managedApp = state.local.apps[id];
  if (managedApp && managedApp.status === INSTALLED) return true;
  return false;
};
