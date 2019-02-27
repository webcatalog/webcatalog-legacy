const Sentry = require('@sentry/electron');

const { getPreference } = require('./preferences');

const errorMonitoring = getPreference('errorMonitoring');

if (errorMonitoring) {
  Sentry.init({
    dsn: 'https://aa01ce5f69894808a437e3936e1bfab1@sentry.io/1403104',
  });
}

module.exports = Sentry;
