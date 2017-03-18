/* global describe beforeEach afterEach it */

const Application = require('spectron').Application;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const getElectronPath = require('./libs/getElectronPath');

chai.should();
chai.use(chaiAsPromised);

describe('shaka-player-test', function shakaPlayerTest() {
  this.timeout(10000);

  beforeEach(function beforeEach() {
    this.app = new Application({
      path: getElectronPath(),
      args: [
        'app/main.js',
        '--testing=true', // disable auto updater
        '--id=shaka',
        '--url=https://shaka-player-demo.appspot.com/demo/',
        '--name=Shaka',
      ],
    });
    return this.app.start();
  });

  beforeEach(function beforeEach() {
    chaiAsPromised.transferPromiseness = this.app.transferPromiseness;
  });


  afterEach(function afterEach() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
    return null;
  });

  it('run', function run() {
    return this.app.client
      .windowByIndex(1) // use webview
      .waitUntilWindowLoaded()
      .getText('optgroup[label="Unified Streaming"] option:nth-of-type(2)').should.eventually.equal('Tears of Steel (Widevine)')
      .getAttribute('optgroup[label="Unified Streaming"] option:nth-of-type(2)', 'disabled').should.eventually.equal(null);
  });
});
