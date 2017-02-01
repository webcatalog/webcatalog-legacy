/* global argv shell ipcRenderer path clipboard electronSettings */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import WebView from './WebView';

import extractDomain from '../libs/extractDomain';
import { updateLoading } from '../actions/nav';

import Nav from './Nav';

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
    this.props.requestUpdateLoading(false);
    electronSettings.set(`lastpages.${argv.id}`, this.c.getURL());
  }

  render() {
    const { url, requestUpdateLoading } = this.props;

    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Nav
          onBackButtonClick={() => this.c.goBack()}
          onForwardButtonClick={() => this.c.goForward()}
          onRefreshButtonClick={() => this.c.reload()}
        />
        <WebView
          ref={(c) => { this.c = c; }}
          src={url}
          style={{ flex: 1, position: 'relative' }}
          className="webview"
          plugins
          allowpopups
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
};

const mapDispatchToProps = dispatch => ({
  requestUpdateLoading: (isLoading) => {
    dispatch(updateLoading(isLoading));
  },
});

export default connect(
  null, mapDispatchToProps,
)(App);
