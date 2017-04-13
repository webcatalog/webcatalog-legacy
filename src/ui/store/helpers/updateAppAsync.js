/* global fetch */
import installAppAsync from '../helpers/installAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';

const updateAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  uninstallAppAsync({ allAppPath, appId, appName, shouldClearStorageData: false })
    .then(() => {
      // if missing appName or appUrl, get them from server
      if (!appName || !appUrl) {
        return fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog-backend/master/data/json/${appId}.json`)
          .then(response => response.json());
      }

      return {
        name: appName,
        url: appUrl,
      };
    })
    .then(appInfo => installAppAsync({ appId, appName: appInfo.name, appUrl: appInfo.url }));

export default updateAppAsync;
