/* global it */

const harness = require('./utils/_harness');

if (process.platform === 'linux') process.exit(0);

harness('store-test', () => {
  it('Load store', () =>
    global.app.client
      .windowByIndex(0)
      .waitUntilWindowLoaded()
      .waitForVisible('[class^="c1"]'));
}, [
  '--testing=true',
]);
