/* global describe beforeEach afterEach it */

const harness = require('./utils/_harness');

harness('shaka-player-test', () => {
  it('load widevine', () =>
    global.app.client
      .windowByIndex(1) // use webview
      .waitUntilWindowLoaded()
      .getText('optgroup[label="Unified Streaming"] option:nth-of-type(2)').should.eventually.equal('Tears of Steel (Widevine)')
      .getAttribute('optgroup[label="Unified Streaming"] option:nth-of-type(2)', 'disabled').should.eventually.equal(null));
}, [
  '--testing=true', // disable auto updater
  '--id=shaka',
  '--url=https://shaka-player-demo.appspot.com/demo/',
  '--name=Shaka',
]);
