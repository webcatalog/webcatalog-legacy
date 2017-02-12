/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* global window */

// const { ipcRenderer } = require('electron');
require('electron-chromecast');

/* temporarily removed.
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
*/
