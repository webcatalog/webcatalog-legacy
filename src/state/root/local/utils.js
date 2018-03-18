import semver from 'semver';

import {
  INSTALLED,
  UNINSTALLING,
  INSTALLING,
} from '../../../constants/app-statuses';

import getCurrentMoleculeVersion from '../../../helpers/get-current-molecule-version';

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

export const getMoleculeVersion = (state, id) => {
  const managedApp = state.local.apps[id];
  if (managedApp && managedApp.app && managedApp.app.moleculeVersion) {
    return managedApp.app.moleculeVersion;
  }
  return '0.0.0';
};

export const isDeprecated = (state, id) => {
  const managedApp = state.local.apps[id];
  return !(managedApp && managedApp.app && managedApp.app.icon);
};

export const isUpdatable = (state, id) => {
  const currentMoleculeVersion = getMoleculeVersion(state, id);

  // locally available version
  const localMoleculeVersion = getCurrentMoleculeVersion();

  return (semver.gt(localMoleculeVersion, currentMoleculeVersion)) && !isDeprecated(state, id);
};

export const getAvailableUpdateCount = (state) => {
  let count = 0;

  const managedApps = state.local.apps;

  Object.keys(managedApps).forEach((id) => {
    if (isUpdatable(state, id) && isInstalled(state, id)) {
      count += 1;
    }
  });

  return count;
};

export const nameExists = (state, name) => {
  const managedApps = state.local.apps;

  return Boolean(Object.keys(managedApps).find((id) => {
    if (managedApps[id].app.name === name) {
      return true;
    }

    return false;
  }));
};

export const numberOfApps = (state) => {
  const managedApps = state.local.apps;
  return Object.keys(managedApps).length;
};
