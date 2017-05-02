const secureFetch = require('./secureFetch');
const installAppAsync = require('./installAppAsync');
const uninstallAppAsync = require('./uninstallAppAsync');


const updateAppAsync = (id, oldName, token) =>
  secureFetch(`/api/apps/${id}`, token)
    .then(response => response.json())
    .then(content => content.app)
    .then(preloadedApp =>
      uninstallAppAsync(id, oldName, { shouldClearStorageData: false })
        .then(() => installAppAsync(id, token, { preloadedApp })),
    );


module.exports = updateAppAsync;
