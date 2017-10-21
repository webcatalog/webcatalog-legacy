/* global describe before after */

const Application = require('spectron').Application;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const path = require('path');
// const fs = require('fs-extra');

chai.should();
chai.use(chaiAsPromised);

const createAppAsync = require('../../src');

const getIconFileExt = () => {
  switch (process.platform) {
    case 'darwin': return 'icns';
    case 'win32': return 'ico';
    default: return 'png';
  }
};

/*
const getElectronPath = () => {
  if (process.platform === 'win32') {
    return path.resolve(__dirname, '..', 'dist', 'molecule', 'Molecule.exe');
  } else if (process.platform === 'darwin') {
    return path.resolve(__dirname, '..', 'dist', 'Molecule.app', 'Contents', 'MacOS', 'Molecule');
  }

  return path.resolve(__dirname, '..', 'dist', 'molecule', 'molecule');
};
*/

const getElectronPath = (destPath) => {
  if (process.platform === 'win32') {
    return path.resolve(destPath, 'Molecule.exe');
  } else if (process.platform === 'darwin') {
    return path.resolve(destPath, 'Contents', 'MacOS', 'Molecule');
  }

  return path.resolve(destPath, 'molecule');
};

const harness = (name, fn, args) => {
  describe('When Molecule is created and then launches', function describeWrap() {
    this.timeout(300000);
    global.app = null;

    /*
    before(() =>
      fs.pathExists(getElectronPath())
        .then((exists) => {
          if (exists) return null;

          return createAppAsync(
            'molecule',
            'Molecule',
            'https://webcatalog.io',
            path.resolve(__dirname, '..',
            `828296a5-0969-4a56-8e68-e188b03584b0.${getIconFileExt()}`),
            path.resolve(__dirname, '..', 'dist'),
          );
        })
        .then(() => {
          global.app = new Application({
            path: getElectronPath(),
            args,
            startTimeout: 50000,
            waitTimeout: 50000,
            requireName: 'electronRequire',
          });
          return global.app.start();
        })
        .then(() => {
          chaiAsPromised.transferPromiseness = global.app.transferPromiseness;
        }),
    );
    */

    before(() =>
      createAppAsync(
        'molecule',
        'Molecule',
        'https://webcatalog.io',
        path.resolve(__dirname, '..', `828296a5-0969-4a56-8e68-e188b03584b0.${getIconFileExt()}`),
        path.resolve(__dirname, '..', 'dist'),
      )
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
        }),
    );

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
