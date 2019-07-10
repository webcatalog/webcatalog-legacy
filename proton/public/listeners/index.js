const loadAuthListeners = require('./auth');
const loadGenericListeners = require('./generic');
const loadUpdaterListeners = require('./updater');

const loadListeners = () => {
  loadAuthListeners();
  loadGenericListeners();
  loadUpdaterListeners();
};

module.exports = loadListeners;
