/* global argv shell ipcRenderer path clipboard electronSettings os */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import WebView from './WebView';

import extractDomain from '../libs/extractDomain';
import { updateLoading, updateCanGoBack, updateCanGoForward } from '../actions/nav';

import Nav from './Nav';

console.log(process.platform);

class App extends React.Component {
  constructor() {
    super();
    this.handleNewWindow = this.handleNewWindow.bind(this);
    this.handleDidStopLoading = this.handleDidStopLoading.bind(this);
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

    ipcRenderer.on('go-home', () => {
      c.loadURL(argv.url);
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

  handleDidStopLoading() {
    const {
      requestUpdateLoading, requestUpdateCanGoBack, requestUpdateCanGoForward,
    } = this.props;
    const c = this.c;

    requestUpdateLoading(false);
    requestUpdateCanGoBack(c.canGoBack());
    requestUpdateCanGoForward(c.canGoForward());

    electronSettings.set(`lastpages.${argv.id}`, c.getURL());
  }

  render() {
    const { url, requestUpdateLoading } = this.props;

    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        {os.platform() === 'darwin' ? (
          <Nav
            onHomeButtonClick={() => this.c.loadURL(argv.url)}
            onBackButtonClick={() => this.c.goBack()}
            onForwardButtonClick={() => this.c.goForward()}
            onRefreshButtonClick={() => this.c.reload()}
          />
        ) : null}
        <WebView
          ref={(c) => { this.c = c; }}
          src={url}
          style={{ height: 'calc(100vh - 22px)', width: '100%' }}
          className="webview"
          plugins
          allowpopups
          autoresize
          partition={`persist:${argv.id}`}
          onNewWindow={this.handleNewWindow}
          onDidStartLoading={() => requestUpdateLoading(true)}
          onDidStopLoading={this.handleDidStopLoading}
          preload="./preload.js"
        />
      </div>
    );
  }
}

App.propTypes = {
  url: React.PropTypes.string,
  requestUpdateLoading: React.PropTypes.func,
  requestUpdateCanGoBack: React.PropTypes.func,
  requestUpdateCanGoForward: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  requestUpdateLoading: (isLoading) => {
    dispatch(updateLoading(isLoading));
  },
  requestUpdateCanGoBack: (canGoBack) => {
    dispatch(updateCanGoBack(canGoBack));
  },
  requestUpdateCanGoForward: (canGoForward) => {
    dispatch(updateCanGoForward(canGoForward));
  },
});

export default connect(
  null, mapDispatchToProps,
)(App);
