/* global describe before after */

const { Application } = require('spectron');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');

chai.should();
chai.use(chaiAsPromised);

const getElectronPath = () => {
  if (process.platform === 'win32') {
    return path.resolve(__dirname, '../../dist/win-unpacked/Proton.exe');
  } else if (process.platform === 'darwin') {
    return path.resolve(__dirname, '../../dist/mac/Proton.app/Contents/MacOS/Proton');
  }

  return path.resolve(__dirname, '../../dist/linux-unpacked/proton');
};

const harness = (name, fn, args) => {
  describe('When Proton launches', function describeWrap() {
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
