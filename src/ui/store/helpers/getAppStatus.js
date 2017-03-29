import { NOT_INSTALLED } from '../constants/statuses';

const getAppStatus = (managedApps, appId) => {
  if (managedApps.has(appId)) return managedApps.get(appId).get('status');

  return NOT_INSTALLED;
};

export default getAppStatus;
