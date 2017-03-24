/* global shell remote exec os */

const openApp = (name, id) => {
  switch (os.platform()) {
    case 'darwin': {
      shell.openItem(`${remote.app.getPath('home')}/Applications/WebCatalog Apps/${name}.app`);
      break;
    }
    case 'linux': {
      exec(`gtk-launch ${id}`);
      break;
    }
    case 'win32':
    default: {
      shell.openItem(`${remote.app.getPath('home')}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/WebCatalog Apps/${name}.lnk`);
    }
  }
};

export default openApp;
