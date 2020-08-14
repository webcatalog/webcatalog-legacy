const electron = require('electron');
const { init } = require('@sentry/electron');

const isRenderer = (process && process.type === 'renderer');

init({
  dsn: 'https://62e7e07974474987bda9a65063758b30@o433326.ingest.sentry.io/5390548',
  release: isRenderer ? electron.remote.app.getVersion() : electron.app.getVersion(),
});
