/* global argv shell ipcRenderer path clipboard */
/* eslint-disable no-console */
import React from 'react';
import WebView from './WebView';

import extractDomain from '../libs/extractDomain';

class App extends React.Component {
  constructor() {
    super();
    this.handleNewWindow = this.handleNewWindow.bind(this);
  }

  componentDidMount() {
    const c = this.c;
    ipcRenderer.on('toggle-dev-tools', () => {
      console.log(c);
      c.openDevTools();
    });

    ipcRenderer.on('change-zoom', (event, message) => {
      c.setZoomFactor(message);
    });

    ipcRenderer.on('reload', () => {
      c.reload();
    });

    ipcRenderer.on('go-back', () => {
      c.goBack();
    });

    ipcRenderer.on('go-forward', () => {
      c.goForward();
    });

    ipcRenderer.on('copy-url', () => {
      const currentURL = c.getURL();
      clipboard.writeText(currentURL);
    });
  }

  handleNewWindow(e) {
    const nextUrl = e.url;
    console.log(nextUrl);
    const c = this.c;
    console.log(`newWindow: ${nextUrl}`);
    // open external url in browser if domain doesn't match.
    const curDomain = extractDomain(argv.url);
    const nextDomain = extractDomain(nextUrl);

    // open new window
    if (nextDomain === null) {
      return;
    }

    // navigate
    if (nextDomain && (nextDomain === curDomain || nextDomain === 'accounts.google.com')) {
      // https://github.com/webcatalog/desktop/issues/35
      e.preventDefault();
      c.loadURL(nextUrl);
      return;
    }

    // open in browser
    e.preventDefault();
    shell.openExternal(nextUrl);
  }

  render() {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <nav
          className="pt-navbar"
          style={{
            display: 'flex',
            WebkitUserSelect: 'none',
            WebkitAppRegion: 'drag',
            flexBasis: 22,
            height: 22,
          }}
        />
        <WebView
          ref={(c) => { this.c = c; }}
          src="https://messenger.com"
          style={{ flex: 1 }}
          className="webview"
          plugins
          allowpopups
          partition={argv.id ? `persist:${argv.id}` : 'persist:webcatalog'}
          onNewWindow={this.handleNewWindow}
          preload="./preload.js"
        />
      </div>
    );
  }
}

export default App;
