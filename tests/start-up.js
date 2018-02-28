/* global it */

const harness = require('./utils/_harness');

harness('store-test', () => {
  it('Load WebCatalog Lite', () =>
    global.app.client
      .windowByIndex(0)
      .waitUntilWindowLoaded()
      .waitForVisible('.jss1'));
}, [
  '--testing=true',
]);
