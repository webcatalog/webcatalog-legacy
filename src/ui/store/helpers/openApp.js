import { remote, shell } from 'electron';

const openApp = (name, id) => {
  const os = remote.require('os');

  switch (os.platform()) {
    case 'darwin': {
      const path = remote.require('path');
      const appPath = path.join(remote.app.getPath('home'), 'Applications', 'WebCatalog Apps', `${name}.app`);
      shell.openItem(appPath);
      break;
    }
    case 'linux': {
      const { exec } = remote.require('child_process');
      exec(`gtk-launch webcatalog-${id}`);
      break;
    }
    case 'win32':
    default: {
      const path = remote.require('path');
      const shortcutPath = path.join(remote.app.getPath('home'), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WebCatalog Apps', `${name}.lnk`);
      shell.openItem(shortcutPath);
    }
  }
};

export default openApp;
