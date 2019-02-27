const Sentry = require('@sentry/electron');

const { getPreference } = require('./preferences');

const errorMonitoring = getPreference('errorMonitoring');

if (errorMonitoring) {
  Sentry.init({
    dsn: 'https://60e93671525249578b5cf7c44822a059@sentry.io/1404106',
  });
}

module.exports = Sentry;
