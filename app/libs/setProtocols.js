const { app } = require('electron');

const setProtocols = () => {
  app.setAsDefaultProtocolClient('webcatalog');
};

module.exports = setProtocols;
