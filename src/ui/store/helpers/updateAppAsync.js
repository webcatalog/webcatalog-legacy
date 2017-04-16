/* global fetch */
import downloadIconAsync from './downloadIconAsync';
import installAppAsync from './installAppAsync';

const updateAppAsync = ({ appId, appName, appUrl }) =>
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
    .then(fetchedInfo =>
      downloadIconAsync(appId)
        .then(iconPath =>
          installAppAsync({
            appId,
            appName: fetchedInfo.name,
            appUrl: fetchedInfo.url,
            iconPath,
          }),
        ),
    );


export default updateAppAsync;
