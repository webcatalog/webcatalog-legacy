/* global it */

const harness = require('./utils/_harness');

harness('store-test', () => {
  it('Load store', () =>
    global.app.client
      .waitForVisible('[class^="jss1"]'));
}, [
  '--testing=true',
]);
