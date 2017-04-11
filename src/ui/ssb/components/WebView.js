// https://github.com/alexstrat/react-electron-web-view/blob/master/src/ElectronWebView.jsx
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';

const events = [
  'load-commit',
  'did-attach',
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'did-get-response-details',
  'did-get-redirect-request',
  'dom-ready',
  'page-title-updated',
  'page-favicon-updated',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'console-message',
  'new-window',
  'close',
  'ipc-message',
  'crashed',
  'gpu-crashed',
  'plugin-crashed',
  'destroyed',
  'found-in-page',
  'update-target-url',
];

const methods = [
  'loadURL',
  'getURL',
  'getTitle',
  'isLoading',
  'isWaitingForResponse',
  'stop',
  'reload',
  'reloadIgnoringCache',
  'canGoBack',
  'canGoForward',
  'canGoToOffset',
  'clearHistory',
  'goBack',
  'goForward',
  'goToIndex',
  'goToOffset',
  'isCrashed',
  'setUserAgent',
  'getUserAgent',
  'insertCSS',
  'executeJavaScript',
  'openDevTools',
  'closeDevTools',
  'isDevToolsOpened',
  'isDevToolsFocused',
  'inspectElement',
  'inspectServiceWorker',
  'setAudioMuted',
  'isAudioMuted',
  'undo',
  'redo',
  'cut',
  'copy',
  'paste',
  'pasteAndMatchStyle',
  'delete',
  'selectAll',
  'unselect',
  'replace',
  'replaceMisspelling',
  'insertText',
  'findInPage',
  'stopFindInPage',
  'print',
  'printToPDF',
  'capturePage',
  'send',
  'sendInputEvent',
  'setZoomFactor',
  'setZoomLevel',
  'showDefinitionForSelection',
  'getWebContents',
  'focus',
];

const props = {
  src: PropTypes.string,
  autosize: PropTypes.bool,
  nodeintegration: PropTypes.bool,
  plugins: PropTypes.bool,
  preload: PropTypes.string,
  httpreferrer: PropTypes.string,
  useragent: PropTypes.string,
  disablewebsecurity: PropTypes.bool,
  partition: PropTypes.string,
  allowpopups: PropTypes.bool,
  blinkfeatures: PropTypes.string,
  disableblinkfeatures: PropTypes.string,
  guestinstance: PropTypes.number,
  devtools: PropTypes.bool,
  muted: PropTypes.bool,
  webpreferences: PropTypes.string,
};

class ElectronWebView extends React.Component {
  componentDidMount() {
    const container = this.c;
    let propString = '';
    Object.keys(props).forEach((propName) => {
      if (typeof this.props[propName] !== 'undefined') {
        if (typeof this.props[propName] === 'boolean') {
          if (this.props[propName] === true) propString += `${propName}=on" `;
        } else {
          propString += `${propName}=${JSON.stringify(this.props[propName].toString())} `;
        }
      }
    });
    if (this.props.className) {
      propString += `class="${this.props.className}" `;
    }
    container.innerHTML = `<webview ${propString}/>`;
    this.view = container.querySelector('webview');

    this.ready = false;
    this.view.addEventListener('did-attach', (...attachArgs) => {
      this.ready = true;
      events.forEach((event) => {
        this.view.addEventListener(event, (...eventArgs) => {
          const propName = camelCase(`on-${event}`);
          // console.log('Firing event: ', propName, ' has listener: ', !!this.props[propName]);
          if (this.props[propName]) this.props[propName](...eventArgs);
        });
      });
      if (this.props.onDidAttach) this.props.onDidAttach(...attachArgs);
    });

    methods.forEach((method) => {
      this[method] = (...args) => {
        if (!this.ready) {
          throw new Error('WebView is not ready yet, you can\'t call this method');
        }
        return this.view[method](...args);
      };
    });
    this.setDevTools = (open) => {
      if (open && !this.isDevToolsOpened()) {
        this.openDevTools();
      } else if (!open && this.isDevToolsOpened()) {
        this.closeDevTools();
      }
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  isReady() {
    return this.ready;
  }

  render() {
    return <div ref={(c) => { this.c = c; }} style={this.props.style || {}} />;
  }
}

ElectronWebView.propTypes = Object.assign({
  className: PropTypes.string,
  style: PropTypes.object,
}, props);

events.forEach((event) => {
  ElectronWebView.propTypes[camelCase(`on-${event}`)] = PropTypes.func;
});

export default ElectronWebView;
