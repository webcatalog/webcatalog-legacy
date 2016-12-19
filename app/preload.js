/* eslint-disable import/no-extraneous-dependencies */
/* global window */

const { ipcRenderer, webFrame } = require('electron');

ipcRenderer.on('change-zoom', (event, message) => {
  webFrame.setZoomFactor(message);
});

/**
 * Patches window.Notification to set a callback on a new Notification
 * @param callback
 */
const setNotificationCallback = (callback) => {
  const OldNotify = window.Notification;
  const newNotify = (title, opt) => {
    callback(title, opt);
    return new OldNotify(title, opt);
  };
  newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
  Object.defineProperty(newNotify, 'permission', {
    get: () => OldNotify.permission,
  });

  window.Notification = newNotify;
};

setNotificationCallback((title, opt) => {
  ipcRenderer.send('notification', title, opt);
});
