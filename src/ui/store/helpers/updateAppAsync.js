/* global fetch */
import downloadIconAsync from './downloadIconAsync';
import installAppAsync from './installAppAsync';
import uninstallAppAsync from './uninstallAppAsync';

const updateAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  Promise.resolve()
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
    .then(appInfo =>
      downloadIconAsync(appId)
        .then(iconPath =>
          uninstallAppAsync({ allAppPath, appId, appName, shouldClearStorageData: false })
            .then(() =>
              installAppAsync({ appId, appName: appInfo.name, appUrl: appInfo.url, iconPath })),
        ),
    );


export default updateAppAsync;
