/* global it */
const assert = require('assert');

const harness = require('./utils/_harness');

harness('start-up', () => {
  it('Start up', () =>
    global.app.client
      .getWindowCount().then((count) => {
        assert.equal(count, 2);
      }));

  if (process.platform !== 'win32') {
    it('Start video with widevine', () =>
      global.app.client
        .windowByIndex(1)
        .waitUntilWindowLoaded()
        .getText('#drmUsageDrm')
        .then((text) => {
          assert.equal(text, 'widevine');
        }));
  }
}, []);
