/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow } = require('electron');

const sendMessageToWindow = (...args) => {
  const windows = BrowserWindow.getAllWindows();
  if (windows.length > 0) {
    windows[0].webContents.send(...args);
  }
};

module.exports = sendMessageToWindow;
