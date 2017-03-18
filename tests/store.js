/* global describe beforeEach afterEach it */

const harness = require('./utils/_harness');

harness('store-test', () => {
  it('Load store', () =>
    global.app.client
      .windowByIndex(0)
      .waitUntilWindowLoaded()
      .waitForVisible('.pt-navbar'));
}, [
  '--testing=true',
]);
