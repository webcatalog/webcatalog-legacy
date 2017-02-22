/* eslint-disable import/no-extraneous-dependencies */
const { app } = require('electron');

const setProtocols = () => {
  app.setAsDefaultProtocolClient('webcatalog');
};

module.exports = setProtocols;
