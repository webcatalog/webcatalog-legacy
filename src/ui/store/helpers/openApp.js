/* global shell remote exec os path */

const openApp = (name, id) => {
  switch (os.platform()) {
    case 'darwin': {
      const appPath = path.join(remote.app.getPath('home'), 'Applications', 'WebCatalog Apps', `${name}.app`);
      shell.openItem(appPath);
      break;
    }
    case 'linux': {
      exec(`gtk-launch ${id}`);
      break;
    }
    case 'win32':
    default: {
      const shortcutPath = path.join(remote.app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
      shell.openItem(shortcutPath);
    }
  }
};

export default openApp;
