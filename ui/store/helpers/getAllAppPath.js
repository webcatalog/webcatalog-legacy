/* global os remote fs mkdirp */

let allAppPath;
switch (os.platform()) {
  case 'darwin': {
    allAppPath = `${remote.app.getPath('home')}/Applications/WebCatalog Apps`;
    break;
  }
  case 'linux': {
    allAppPath = `${remote.app.getPath('home')}/.local/share/applications`;
    break;
  }
  case 'win32':
  default: {
    allAppPath = `${remote.app.getPath('home')}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps`;
  }
}

// ensure the folder exists
if (!fs.existsSync(allAppPath)) {
  mkdirp.sync(allAppPath);
}

const getAllAppPath = () => allAppPath;

export default getAllAppPath;
