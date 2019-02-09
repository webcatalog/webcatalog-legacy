const {
  ipcRenderer,
  remote,
  webFrame,
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
const { spellChecking } = preferences;

window.onload = () => {
  window.close = () => {
    ipcRenderer.send('request-go-home');
  };

  window.spellCheckHandler = new SpellCheckHandler();
  setTimeout(() => window.spellCheckHandler.attachToInput(), 1000);

  window.spellCheckHandler.switchLanguage('en-US');

  window.contextMenuBuilder = new ContextMenuBuilder(
    spellChecking ? window.spellCheckHandler : null,
    null,
    true,
  );
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
};

// Fix Can't show file list of Google Drive
// https://github.com/electron/electron/issues/16587
webFrame.executeJavaScript(`
window.chrome = {
  runtime: {
    connect: () => {
      return {
        onMessage: {
          addListener: () => {},
          removeListener: () => {},
        },
        postMessage: () => {},
        disconnect: () => {},
      }
    }
  }
}
`);
