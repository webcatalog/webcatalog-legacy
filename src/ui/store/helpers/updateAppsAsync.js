import { remote } from 'electron';

import installAppAsync from '../helpers/installAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';
import getObjectsAsync from '../helpers/getObjectsAsync';

const shouldUpdate = version => (version.toString() < '3.2.5' && remote.require('os').platform() === 'darwin');

// apps = { id, version }
const updateAppsAsync = ({ allAppPath, installedApps }) => {
  const neededToUpdateAppIds = installedApps
    .filter(({ version }) => shouldUpdate(version))
    .map(({ id }) => id);

  /* eslint-disable no-console */
  console.log(`Updating apps: ${neededToUpdateAppIds.join(';')}`);
  /* eslint-enable no-console */

  if (neededToUpdateAppIds.length > 0) {
    return getObjectsAsync({
      objectIds: neededToUpdateAppIds,
    })
    .then((content) => {
      const hits = content.results ? content.results.filter(hit => hit !== null) : [];

      const promises = hits
        .map(({ id, name, url }) => {
          const appId = id;
          const appName = name;
          const appUrl = url;
          return uninstallAppAsync({ allAppPath, appId, appName })
            .then(() => installAppAsync({ allAppPath, appId, appName, appUrl }));
        });

      return Promise.all(promises);
    });
  }

  return Promise.resolve();
};

export default updateAppsAsync;
