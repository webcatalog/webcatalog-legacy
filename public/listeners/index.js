const loadGenericListeners = require('./generic');
const loadLocalListeners = require('./local');

const loadListeners = () => {
  loadGenericListeners();
  loadLocalListeners();
};

module.exports = loadListeners;
