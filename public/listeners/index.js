const loadAuthListeners = require('./auth');
const loadGenericListeners = require('./generic');
const loadLocalListeners = require('./local');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadAuthListeners();
  loadGenericListeners();
  loadLocalListeners();
  loadUpdaterListeners();
};

module.exports = loadListeners;
