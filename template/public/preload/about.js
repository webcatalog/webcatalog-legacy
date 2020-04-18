const path = require('path');

window.mode = 'about';

window.iconPath = path.join(__dirname, '..', 'icon.png');

const { remote } = require('electron');
const contextMenu = require('electron-context-menu');

contextMenu({
  window: remote.getCurrentWindow(),
});

window.getVersions = () => [
  { name: 'Electron Version', version: process.versions.electron },
  { name: 'Node Version', version: process.versions.node },
  { name: 'Chrome Version', version: process.versions.chrome },
];
