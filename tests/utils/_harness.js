/* global describe before after */

const Application = require('spectron').Application;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');

chai.should();
chai.use(chaiAsPromised);

const getElectronPath = () =>
  path.resolve(__dirname, '../../dist/mac/WebCatalog.app/Contents/MacOS/WebCatalog');

const harness = (name, fn, args) => {
  describe('When WebCatalog launches', function describeWrap() {
    this.timeout(100000);
    global.app = null;

    before(() => {
      global.app = new Application({
        path: getElectronPath(),
        args,
        startTimeout: 50000,
        waitTimeout: 50000,
      });
      return global.app.start()
        .then(() => {
          chaiAsPromised.transferPromiseness = global.app.transferPromiseness;
        });
    });

    describe(name, fn);

    after(() => {
      if (global.app && global.app.isRunning()) {
        return global.app.stop();
      }
      return null;
    });
  });
};

module.exports = harness;
