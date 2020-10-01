/* eslint-disable prefer-template */
/* eslint-disable quote-props */
// modified from https://github.com/minbrowser/min/blob/master/main/registryConfig.js
// fix https://github.com/webcatalog/webcatalog-app/issues/784

const regedit = require('regedit');

// const appId = 'webcatalog-singlebox';
// const appName = 'Singlebox';
// const installPath = 'C:\\Users\\username\\AppData\\Local\\Programs\\Singlebox\\Singlebox.exe';

const getKeysToCreate = (appId) => [
  `HKCU\\Software\\Classes\\${appId}`,
  `HKCU\\Software\\Classes\\${appId}\\Application`,
  `HKCU\\Software\\Classes\\${appId}\\DefaulIcon`,
  `HKCU\\Software\\Classes\\${appId}\\shell\\open\\command`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\FileAssociations`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\StartMenu`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\URLAssociations`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\DefaultIcon`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\InstallInfo`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\shell\\open\\command`,
];

const getRegistryConfig = (appId, appName, installPath) => ({
  'HKCU\\Software\\RegisteredApplications': {
    [appId]: {
      value: `Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities`,
      type: 'REG_SZ',
    },
  },
  [`HKCU\\Software\\Classes\\${appId}`]: {
    'default': {
      value: `${appName} Browser Document`,
      type: 'REG_DEFAULT',
    },
  },
  [`HKCU\\Software\\Classes\\${appId}\\Application`]: {
    'ApplicationIcon': {
      value: installPath + ',0',
      type: 'REG_SZ',
    },
    'ApplicationName': {
      value: appName,
      type: 'REG_SZ',
    },
    'AppUserModelId': {
      value: appId,
      type: 'REG_SZ',
    },
  },
  [`HKCU\\Software\\Classes\\${appId}\\DefaulIcon`]: {
    'ApplicationIcon': {
      value: installPath + ',0',
      type: 'REG_SZ',
    },
  },
  [`HKCU\\Software\\Classes\\${appId}\\shell\\open\\command`]: {
    'default': {
      value: '"' + installPath + '" "%1"',
      type: 'REG_DEFAULT',
    },
  },
  /*
  'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds': {
      'Singlebox': {
      value: 'Empty',
      type: 'REG_SZ',
      }
  },
  'HKCU\\Software\\Classes\\.html\\OpenWithProgIds': {
      'Singlebox': {
      value: 'Empty',
      type: 'REG_SZ',
      },
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\Singlebox\\Capabilities\\FileAssociations': {
      '.htm': {
      value: 'Singlebox',
      type: 'REG_SZ',
      },
      '.html': {
      value: 'Singlebox',
      type: 'REG_SZ',
      },
  },
  */
  [`HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\StartMenu`]: {
    'StartMenuInternet': {
      value: appId,
      type: 'REG_SZ',
    },
  },
  [`HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\URLAssociations`]: {
    'http': {
      value: appId,
      type: 'REG_SZ',
    },
    'https': {
      value: appId,
      type: 'REG_SZ',
    },
    'mailto': {
      value: appId,
      type: 'REG_SZ',
    },
  },
  [`HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\DefaultIcon`]: {
    'default': {
      value: installPath + ',0',
      type: 'REG_DEFAULT',
    },
  },
  [`HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\InstallInfo`]: {
    'IconsVisible': {
      value: 1,
      type: 'REG_DWORD',
    },
  },
  [`HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\shell\\open\\command`]: {
    'default': {
      value: installPath,
      type: 'REG_DEFAULT',
    },
  },
});

const registryInstaller = {
  installAsync: (appId, appName, installPath) => new Promise((resolve, reject) => {
    regedit.createKey(getKeysToCreate(appId), (err) => {
      regedit.putValue(getRegistryConfig(appId, appName, installPath), (err2) => {
        if (err || err2) {
          reject(err || err2);
        } else {
          resolve();
        }
      });
    });
  }),
  uninstallAsync: (appId) => new Promise((resolve, reject) => {
    regedit.deleteKey(getKeysToCreate(appId), (err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  }),
};

module.exports = registryInstaller;
