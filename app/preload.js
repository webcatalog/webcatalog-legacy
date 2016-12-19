/* eslint-disable import/no-extraneous-dependencies */

const { ipcRenderer, webFrame } = require('electron');

ipcRenderer.on('change-zoom', (event, message) => {
  webFrame.setZoomFactor(message);
});
