const { app } = require('electron');
const Sentry = require('@sentry/electron');
const { getPreference } = require('./preferences');

let initiated = false;

const init = () => {
  const errorMonitoring = getPreference('errorMonitoring');

  if (errorMonitoring && app.isPackaged) {
    Sentry.init({
      dsn: 'https://aa01ce5f69894808a437e3936e1bfab1@sentry.io/1403104',
      release: `webcatalog/${app.getVersion()}`,
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
