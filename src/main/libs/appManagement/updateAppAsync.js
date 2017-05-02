/* global fetch */
import installAppAsync from './installAppAsync';
import uninstallAppAsync from './uninstallAppAsync';

const updateAppAsync = (id, oldName, token) =>
  uninstallAppAsync(id, oldName, { shouldClearStorageData: false })
    .then(() => installAppAsync(id, token));


module.exports = updateAppAsync;
