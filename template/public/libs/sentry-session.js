const { app } = require('electron');
const Sentry = require('@sentry/electron');
const { getPreference } = require('./preferences');

let initiated = false;

const init = () => {
  const errorMonitoring = getPreference('errorMonitoring');

  if (errorMonitoring && app.isPackaged) {
    Sentry.init({
      dsn: 'https://60e93671525249578b5cf7c44822a059@sentry.io/1404106',
      release: `juli/${app.getVersion()}`,
    });
    initiated = true;
  }
};

const get = () => {
  if (initiated) return Sentry;
  return null;
};

module.exports = {
  init,
  get,
};
