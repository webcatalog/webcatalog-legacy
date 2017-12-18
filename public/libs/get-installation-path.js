const { app } = require('electron');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

// legacy
// will be removed soon
if (os.platform() === 'linux') {
  try {
    const oldPath = path.join(app.getPath('userData'), 'apps');
    if (fs.pathExistsSync(oldPath)) {
      const desktopDirPath = path.join(app.getPath('home'), '.local', 'share', 'applications');
      const files = fs.readdirSync(desktopDirPath);
      files.forEach((fileName) => {
        if (fileName.startsWith('webcatalog-')) {
          fs.removeSync(desktopDirPath, fileName);
        }
      });

      fs.removeSync(oldPath);
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
}

const getInstallationPath = () => {
  switch (os.platform()) {
    case 'darwin': {
      return path.join(app.getPath('home'), 'Applications', 'WebCatalog Apps');
    }
    case 'linux': {
      return path.join(app.getPath('home'), '.webcatalog', 'apps');
    }
    case 'win32':
    default: {
      return path.join(app.getPath('userData'), 'Apps');
    }
  }
};

module.exports = getInstallationPath;
