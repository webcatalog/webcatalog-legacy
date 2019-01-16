

import semver from 'semver';

export const isOutdatedApp = (id, state) => {
  const { apps } = state.appManagement;

  const v = apps[id] ? apps[id].version : null;

  const latestV = state.general.latestTemplateVersion;

  if (!v) return true;
  return semver.lt(v, latestV);
};

export const getOutdatedAppsAsList = (state) => {
  const { apps } = state.appManagement;
  return Object.values(apps).filter(app => isOutdatedApp(app.id, state));
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

export const getAppCount = (state) => {
  const { apps } = state.appManagement;
  return Object.values(apps).length;
};
