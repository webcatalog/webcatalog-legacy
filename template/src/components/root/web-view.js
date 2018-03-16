// https://github.com/alexstrat/react-electron-web-view/blob/master/src/ElectronWebView.jsx
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';

const events = [
  'close',
  'console-message',
  'crashed',
  'destroyed',
  'did-attach',
  'did-fail-load',
  'did-finish-load',
  'did-frame-finish-load',
  'did-get-redirect-request',
  'did-get-response-details',
  'did-start-loading',
  'did-stop-loading',
  'dom-ready',
  'enter-html-full-screen',
  'found-in-page',
  'gpu-crashed',
  'ipc-message',
  'leave-html-full-screen',
  'load-commit',
  'new-window',
  'page-favicon-updated',
  'page-title-updated',
  'plugin-crashed',
  'update-target-url',
];

const methods = [
  'canGoBack',
  'canGoForward',
  'canGoToOffset',
  'capturePage',
  'clearHistory',
  'closeDevTools',
  'copy',
  'cut',
  'delete',
  'executeJavaScript',
  'findInPage',
  'focus',
  'getTitle',
  'getURL',
  'getUserAgent',
  'getWebContents',
  'goBack',
  'goForward',
  'goToIndex',
  'goToOffset',
  'insertCSS',
  'insertText',
  'inspectElement',
  'inspectServiceWorker',
  'isAudioMuted',
  'isCrashed',
  'isDevToolsFocused',
  'isDevToolsOpened',
  'isLoading',
  'isWaitingForResponse',
  'loadURL',
  'openDevTools',
  'paste',
  'pasteAndMatchStyle',
  'print',
  'printToPDF',
  'redo',
  'reload',
  'reloadIgnoringCache',
  'replace',
  'replaceMisspelling',
  'selectAll',
  'send',
  'sendInputEvent',
  'setAudioMuted',
  'setUserAgent',
  'setZoomFactor',
  'setZoomLevel',
  'showDefinitionForSelection',
  'stop',
  'stopFindInPage',
  'undo',
  'unselect',
];

const props = {
  allowpopups: PropTypes.bool,
  autosize: PropTypes.bool,
  blinkfeatures: PropTypes.string,
  devtools: PropTypes.bool,
  disableblinkfeatures: PropTypes.string,
  disablewebsecurity: PropTypes.bool,
  guestinstance: PropTypes.number,
  httpreferrer: PropTypes.string,
  muted: PropTypes.bool,
  nodeintegration: PropTypes.bool,
  partition: PropTypes.string,
  plugins: PropTypes.bool,
  preload: PropTypes.string,
  src: PropTypes.string,
  useragent: PropTypes.string,
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
    return <div ref={(c) => { this.c = c; }} className={this.props.parentClassName} />;
  }
}

ElectronWebView.defaultProps = {
  parentClassName: '', // eslint-disable-line
  className: '', // eslint-disable-line
};

ElectronWebView.propTypes = Object.assign({
  parentClassName: PropTypes.string,
  className: PropTypes.string,
}, props);

events.forEach((event) => {
  // eslint-disable-next-line
  ElectronWebView.propTypes[camelCase(`on-${event}`)] = PropTypes.func;
});

export default ElectronWebView;
