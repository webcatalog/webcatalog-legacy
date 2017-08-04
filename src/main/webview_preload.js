const { ipcRenderer, remote } = require('electron');
const spellChecker = require('electron-spellchecker');

const { MenuItem } = remote;

const { SpellCheckHandler, ContextMenuListener, ContextMenuBuilder } = spellChecker;


window.global = {};
window.ipcRenderer = ipcRenderer;

window.spellCheckHandler = new SpellCheckHandler();
setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

window.spellCheckHandler.switchLanguage('en-US');
window.spellCheckHandler.autoUnloadDictionariesOnBlur();

window.contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler, null, true, (menu) => {
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
window.contextMenuListener = new ContextMenuListener((info) => { window.contextMenuBuilder.showPopupMenu(info); });

window.onload = () => {
  // inject JS
  const shellInfo = ipcRenderer.sendSync('get-shell-info');

  document.title = shellInfo.name;

  const injectedJS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedJS`, null);
  if (injectedJS && injectedJS.trim().length > 0) {
    try {
      const node = document.createElement('script');
      node.innerHTML = injectedJS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }

  const injectedCSS = ipcRenderer.sendSync('get-setting', `behaviors.${shellInfo.id}.injectedCSS`, null);
  if (injectedCSS && injectedCSS.trim().length > 0) {
    try {
      const node = document.createElement('style');
      node.innerHTML = injectedCSS;
      document.body.appendChild(node);
    } catch (err) {
      /* eslint-disable no-console */
      console.log(err);
      /* eslint-enable no-console */
    }
  }
};
