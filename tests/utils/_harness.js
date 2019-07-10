/* global describe before after */
const { Application } = require('spectron');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');

chai.should();
chai.use(chaiAsPromised);

const molecule = require('../../src');

const getElectronPath = (destPath) => {
  if (process.platform === 'win32') {
    return path.resolve(destPath, 'Molecule.exe');
  } else if (process.platform === 'darwin') {
    return path.resolve(destPath, 'Contents', 'MacOS', 'Molecule');
  }

  return path.resolve(destPath, 'Molecule');
};

const harness = (name, fn, args) => {
  describe('When Molecule is created and then launches', function describeWrap() {
    this.timeout(300000);
    global.app = null;

    before(() =>
      molecule.createAppAsync(
        'molecule',
        'Molecule',
        'https://bitmovin.com/mpeg-dash-hls-drm-test-player/',
        path.resolve(__dirname, '..', 'icon.png'),
        path.resolve(__dirname, '..', 'dist'),
      )
        .then((appPath) => {
          if (process.platform === 'darwin') {
            return path.join(appPath, 'Molecule.app');
          }

          return appPath;
        })
        .then((destPath) => {
          global.app = new Application({
            path: getElectronPath(destPath),
            args,
            startTimeout: 50000,
            waitTimeout: 50000,
            requireName: 'electronRequire',
          });
          return global.app.start();
        })
        .then(() => {
          chaiAsPromised.transferPromiseness = global.app.transferPromiseness;
        }));

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
