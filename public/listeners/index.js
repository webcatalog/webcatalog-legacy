const loadGenericListeners = require('./generic');
const loadLocalListeners = require('./local');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadGenericListeners();
  loadLocalListeners();
  loadUpdaterListeners();
};

module.exports = loadListeners;
