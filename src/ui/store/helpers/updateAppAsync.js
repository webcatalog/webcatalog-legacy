import installAppAsync from '../helpers/installAppAsync';
import uninstallAppAsync from '../helpers/uninstallAppAsync';

const updateAppAsync = ({ allAppPath, appId, appName, appUrl }) =>
  uninstallAppAsync({ allAppPath, appId, appName, shouldClearStorageData: false })
    .then(() => installAppAsync({ appId, appName, appUrl }));

export default updateAppAsync;
