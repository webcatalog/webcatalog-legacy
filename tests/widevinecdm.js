/* global describe beforeEach afterEach it */

const harness = require('./utils/_harness');

harness('shaka-player-test', () => {
  it('load widevine', () =>
    global.app.client
      .windowByIndex(1) // use webview
      .waitUntilWindowLoaded()
      .getText('#drmUsageDrm').should.eventually.equal('widevine'));
}, [
  '--testing=true', // disable auto updater
  '--id=shaka',
  '--url=https://bitmovin.com/mpeg-dash-hls-drm-test-player/',
  '--name=Shaka',
]);
