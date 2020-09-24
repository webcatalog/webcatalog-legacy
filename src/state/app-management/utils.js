import semver from 'semver';
import { INSTALLING, INSTALLED } from '../../constants/app-statuses';

export const isInstalledApp = (id, state) => {
  const { apps } = state.appManagement;
  return (apps[id] && apps[id].status === INSTALLED);
};

export const isOutdatedApp = (id, state) => {
  const { apps } = state.appManagement;
  const { registered } = state.preferences;

  if (!apps[id]) return true;

  // check if app is installing
  if (apps[id].status === INSTALLING) return false;

  // check if license is correctly assigned
  if (Boolean(apps[id].registered) !== registered) return true;

  const v = apps[id].version;

  // check if lite app is installed using forked-script-lite-v1 (outdated)
  if (apps[id].engine !== 'firefox'
    && window.process.platform === 'darwin' && semver.lt(v, '2.2.0')) {
    return true;
  }

  // check if app is Electron-based
  if (apps[id].engine !== 'electron') return false;

  // check version
  const latestV = state.general.latestTemplateVersion;
  if (!v) return true;
  return semver.lt(v, latestV);
};

export const isCancelableApp = (id, state) => {
  const { apps } = state.appManagement;
  return (apps[id] && apps[id].cancelable);
};

export const getOutdatedAppsAsList = (state) => {
  const { apps, sortedAppIds } = state.appManagement;
  return sortedAppIds.map((id) => apps[id])
    .filter((app) => isOutdatedApp(app.id, state));
};

export const getCancelableAppsAsList = (state) => {
  const { apps, sortedAppIds } = state.appManagement;
  return sortedAppIds.map((id) => apps[id])
    .filter((app) => isCancelableApp(app.id, state));
};

export const getInstallingAppsAsList = (state) => {
  const { apps, sortedAppIds } = state.appManagement;
  return sortedAppIds.map((id) => apps[id])
    .filter((app) => app.status !== 'INSTALLED');
};

export const getAppBadgeCount = (state) => {
  const { apps } = state.appManagement;
  return Object.values(apps)
    .filter((app) => isOutdatedApp(app.id, state) || app.status !== 'INSTALLED').length;
};

export const isNameExisted = (name, state) => {
  const { apps } = state.appManagement;
  return Boolean(Object.keys(apps).find((id) => {
    if (apps[id].name === name) {
      return true;
    }

    return false;
  }));
};
