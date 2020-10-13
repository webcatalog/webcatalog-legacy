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
  `HKCU\\Software\\Classes\\${appId}\\shell`,
  `HKCU\\Software\\Classes\\${appId}\\shell\\open`,
  `HKCU\\Software\\Classes\\${appId}\\shell\\open\\command`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\FileAssociations`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\StartMenu`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\Capabilities\\URLAssociations`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\DefaultIcon`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\InstallInfo`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\shell`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\shell\\open`,
  `HKCU\\Software\\Clients\\StartMenuInternet\\${appId}\\shell\\open\\command`,
];

const getKeysToDelete = (appId) => {
  const keys = getKeysToCreate(appId);
  // reverse (delete from lower level first)
  // if not, it will return "access is denied"
  keys.reverse();
  return keys;
};

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

const deleteKeyAsync = (key) => new Promise((resolve, reject) => {
  regedit.deleteKey(key, (err) => {
    if (err) {
      // registry path does not exist
      if (err.code === 2) { resolve(); }
      reject(err);
    } else {
      resolve();
    }
  });
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
  uninstallAsync: (appId) => {
    // delete one by one from lower level to upper level
    // to avoid "access is denied"
    let promise = Promise.resolve();
    const keys = getKeysToDelete(appId);
    keys.forEach((key) => {
      promise = promise.then(() => deleteKeyAsync(key));
    });
    return promise;
  },
};

module.exports = registryInstaller;
