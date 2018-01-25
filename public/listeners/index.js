const loadGenericListeners = require('./generic');
const loadLocalListeners = require('./local');
const loadPreferencesListeners = require('./preferences');

const loadListeners = () => {
  loadGenericListeners();
  loadLocalListeners();
  loadPreferencesListeners();
};

module.exports = loadListeners;
