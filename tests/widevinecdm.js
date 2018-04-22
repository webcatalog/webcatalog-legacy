/* global it */

const harness = require('./utils/_harness');
const assert = require('assert');

harness('widevinecdm-test', () => {
  it('Load WidevineCDM', () =>
    global.app.client
      .windowByIndex(1)
      .waitUntilWindowLoaded()
      .getText('#drmUsageDrm')
      .then((text) => {
        assert.equal(text, process.platform === 'win32' ? 'Apple HLS AES 128' : 'widevine');
      }));
}, [
  '--testing=true',
  '--url=https://bitmovin.com/mpeg-dash-hls-drm-test-player/',
  '--id=test_widevinecdm',
  '--name=Test',
]);
