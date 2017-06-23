/* global it */

const harness = require('./utils/_harness');

harness('store-test', () => {
  it('Load store', () =>
    global.app.client
      .windowByIndex(0)
      .waitUntilWindowLoaded()
      .waitForVisible('[class^="App-root"]'));
}, [
  '--testing=true',
]);
