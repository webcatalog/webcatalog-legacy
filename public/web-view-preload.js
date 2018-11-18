if (process.env.NODE_ENV === 'test') {
  window.electronRequire = require;
}

const {
  ipcRenderer,
  remote,
} = require('electron');
const {
  SpellCheckHandler,
  ContextMenuListener,
  ContextMenuBuilder,
} = require('electron-spellchecker');

const { MenuItem } = remote;

window.global = {};
window.ipcRenderer = ipcRenderer;

const preferences = ipcRenderer.sendSync('get-preferences');
const { injectCSS, injectJS, spellChecking } = preferences;

window.onload = () => {
  // inject JS
  document.title = remote.getGlobal('shellInfo').name;

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

window.spellCheckHandler = new SpellCheckHandler();
setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

window.spellCheckHandler.provideHintText('This is probably the language that you want to check in');
window.spellCheckHandler.autoUnloadDictionariesOnBlur();

window.contextMenuBuilder = new ContextMenuBuilder(spellChecking ? window.spellCheckHandler : null,
  null, true);
window.contextMenuListener = new ContextMenuListener((info) => {
  window.contextMenuBuilder.buildMenuForElement(info)
    .then((menu) => {
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

      menu.popup(remote.getCurrentWindow());
    });
});
