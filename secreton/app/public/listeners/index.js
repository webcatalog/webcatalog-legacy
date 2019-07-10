const loadGenericListeners = require('./generic');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadGenericListeners();
  loadUpdaterListeners();
};

module.exports = loadListeners;
