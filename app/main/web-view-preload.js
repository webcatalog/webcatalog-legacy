if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
}

const {
  ipcRenderer,
  remote,
} = require('electron');
const spellChecker = require('electron-spellchecker');

const { getPreferences } = require('./libs/preferences');

const webApp = require('../package.json').webApp;

const { Menu, MenuItem } = remote;

const { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } = spellChecker;

window.global = {};
window.ipcRenderer = ipcRenderer;

const preferences = getPreferences();
const { injectCSS, injectJS, useSpellChecker } = preferences;

if (useSpellChecker) {
  window.spellCheckHandler = new SpellCheckHandler();
  setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

  window.spellCheckHandler.switchLanguage('en-US');
  window.spellCheckHandler.autoUnloadDictionariesOnBlur();

  window.contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler, null, true,
    (menu) => {
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({
        label: 'Back',
        click: () => {
          remote.getCurrentWindow().send('go-back');
        },
      }));
      menu.append(new MenuItem({
        label: 'Forward',
        click: () => {
          remote.getCurrentWindow().send('go-forward');
        },
      }));
      menu.append(new MenuItem({
        label: 'Reload',
        click: () => {
          remote.getCurrentWindow().send('reload');
        },
      }));
    });

  window.contextMenuListener = new ContextMenuListener((info) => {
    window.contextMenuBuilder.showPopupMenu(info);
  });
} else {
  // Inspect element
  // Importing this adds a right-click menu with 'Inspect Element' option
  let rightClickPosition = null;

  const menu = new Menu();
  menu.append(new MenuItem({
    label: 'Back',
    click: () => {
      remote.getCurrentWindow().send('go-back');
    },
  }));
  menu.append(new MenuItem({
    label: 'Forward',
    click: () => {
      remote.getCurrentWindow().send('go-forward');
    },
  }));
  menu.append(new MenuItem({
    label: 'Reload',
    click: () => {
      remote.getCurrentWindow().send('reload');
    },
  }));
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({
    label: 'Inspect Element',
    click: () => {
      const { webContents } = remote;
      webContents
        .getFocusedWebContents()
        .inspectElement(rightClickPosition.x, rightClickPosition.y);
    },
  }));

  window.oncontextmenu = (e) => {
    e.preventDefault();
    rightClickPosition = { x: e.x, y: e.y };
    menu.popup(remote.getCurrentWindow());
  };
}

window.onload = () => {
  // inject JS
  document.title = webApp.name;

  if (injectJS && injectJS.trim().length > 0) {
    try {
      const node = document.createElement('script');
      node.innerHTML = injectJS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }

  if (injectCSS && injectCSS.trim().length > 0) {
    try {
      const node = document.createElement('style');
      node.innerHTML = injectCSS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }
};
