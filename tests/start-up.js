/* global it */

const harness = require('./utils/_harness');

harness('store-test', () => {
  it('Load WebCatalog', () =>
    global.app.client
      .waitForVisible('.jss1'));
}, [
  '--testing=true',
]);
