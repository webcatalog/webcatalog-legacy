if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
}

const {
  ipcRenderer,
  remote,
} = require('electron');
const spellChecker = require('electron-spellchecker');

const { MenuItem } = remote;

const { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } = spellChecker;

window.global = {};
window.ipcRenderer = ipcRenderer;

window.spellCheckHandler = new SpellCheckHandler();
setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

window.spellCheckHandler.switchLanguage('en-US');
window.spellCheckHandler.autoUnloadDictionariesOnBlur();

window.contextMenuBuilder = new ContextMenuBuilder(
  window.spellCheckHandler, null, true,
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
  },
);

window.contextMenuListener = new ContextMenuListener((info) => {
  window.contextMenuBuilder.showPopupMenu(info);
});
