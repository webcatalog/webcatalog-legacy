const loadGenericListeners = require('./generic');
const loadLocalListeners = require('./local');
const loadUpdaterListeners = require('./updater');
const loadPreferencesListeners = require('./preferences');

const loadListeners = () => {
  loadGenericListeners();
  loadLocalListeners();
  loadUpdaterListeners();
  loadPreferencesListeners();
};

module.exports = loadListeners;
