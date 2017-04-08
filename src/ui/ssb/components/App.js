/* eslint-disable no-console */
/* global Notification */
import { remote, ipcRenderer, clipboard, shell } from 'electron';
import React from 'react';
import { connect } from 'react-redux';
import camelCase from 'lodash.camelcase';

import WebView from './WebView';
import Settings from './Settings';
import Nav from './Nav';
import FindInPage from './FindInPage';

import extractDomain from '../libs/extractDomain';
import { updateTargetUrl, updateLoading, updateCanGoBack, updateCanGoForward } from '../actions/nav';
import { toggleSettingDialog } from '../actions/settings';
import { toggleFindInPageDialog, updateFindInPageMatches } from '../actions/findInPage';
import { screenResize } from '../actions/screen';

const appInfo = remote.getCurrentWindow().appInfo;

let didShowNotification = false;

class App extends React.Component {
  constructor() {
    super();
    this.handleNewWindow = this.handleNewWindow.bind(this);
    this.handleDidStopLoading = this.handleDidStopLoading.bind(this);
    this.handleDidGetRedirectRequest = this.handleDidGetRedirectRequest.bind(this);
    this.handleUpdateTargetUrl = this.handleUpdateTargetUrl.bind(this);
  }

  componentDidMount() {
    const {
      requestToggleSettingDialog,
      requestToggleFindInPageDialog,
      requestUpdateFindInPageMatches,
      onResize,
    } = this.props;
    const c = this.c;

    window.addEventListener('resize', onResize);

    ipcRenderer.on('toggle-dev-tools', () => {
      c.openDevTools();
    });

    ipcRenderer.on('toggle-setting-dialog', () => {
      requestToggleSettingDialog();
    });

    ipcRenderer.on('toggle-find-in-page-dialog', () => {
      if (this.props.findInPageIsOpen) {
        c.stopFindInPage('clearSelection');
        requestUpdateFindInPageMatches(0, 0);
      }
      requestToggleFindInPageDialog();
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
      c.loadURL(this.props.customHome || appInfo.url);
    });

    ipcRenderer.on('go-to-url', (e, url) => {
      c.loadURL(url);
    });

    ipcRenderer.on('copy-url', () => {
      const currentURL = c.getURL();
      clipboard.writeText(currentURL);
    });

    remote.getCurrentWindow().on('focus', () => {
      didShowNotification = false;
    });
  }

  componentDidUpdate() {
    const { findInPageIsOpen, findInPageText } = this.props;
    const c = this.c;

    // Restart search if text is available
    if (findInPageIsOpen && findInPageText.length > 0) {
      c.findInPage(findInPageText, { forward: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onResize);
  }

  handleDidGetRedirectRequest(e) {
    const c = this.c;
    const { newURL, isMainFrame } = e;
    // https://github.com/webcatalog/webcatalog/issues/42
    if (isMainFrame && extractDomain(newURL) === 'twitter.com') {
      setTimeout(() => c.loadURL(newURL), 100);
      e.preventDefault();
    }
  }

  handleNewWindow(e) {
    const nextUrl = e.url;
    const c = this.c;
    console.log(`newWindow: ${nextUrl}`);
    // open external url in browser if domain doesn't match.
    const curDomain = extractDomain(appInfo.url);
    const nextDomain = extractDomain(nextUrl);

    console.log(nextDomain);

    // open new window
    if (
      nextDomain === null
      || nextDomain === 'feedly.com'
      || nextUrl.indexOf('oauth') > -1 // Works with Google & Facebook.
    ) {
      return;
    }

    // navigate
    if (nextDomain && (nextDomain === curDomain || nextDomain === 'accounts.google.com')) {
      // https://github.com/webcatalog/webcatalog/issues/35
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

    const electronSettings = remote.require('electron-settings');
    electronSettings.set(`lastPages.${camelCase(appInfo.id)}`, c.getURL());
  }

  handlePageTitleUpdated({ title }) {
    remote.getCurrentWindow().setTitle(title);

    const itemCountRegex = /[([{](\d*?)[}\])]/;
    const match = itemCountRegex.exec(title);
    const newBadge = match ? match[1] : '';

    ipcRenderer.send('badge', newBadge);

    if (newBadge !== '' && didShowNotification === false && remote.getCurrentWindow().isFocused() === false) {
      /* eslint-disable no-unused-vars */
      const notif = new Notification(appInfo.name, {
        body: 'You have a notification.',
      });
      /* eslint-enable no-unused-vars */
      // to prevent multiple notification like blinking titlebar
      didShowNotification = true;
    }
  }

  handleUpdateTargetUrl({ url }) {
    const { requestUpdateTargetUrl } = this.props;
    requestUpdateTargetUrl(url);
  }

  render() {
    const {
      url, findInPageIsOpen, isFullScreen, customHome,
      requestUpdateLoading, requestUpdateFindInPageMatches,
      targetUrl,
    } = this.props;

    const showNav = (remote.require('os').platform() === 'darwin' && !isFullScreen);

    let usedHeight = showNav ? 32 : 0;
    if (findInPageIsOpen) usedHeight += 50;

    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        {showNav ? (
          <Nav
            onHomeButtonClick={() => this.c.loadURL(customHome || appInfo.url)}
            onBackButtonClick={() => this.c.goBack()}
            onForwardButtonClick={() => this.c.goForward()}
            onRefreshButtonClick={() => this.c.reload()}
          />
        ) : null}
        {findInPageIsOpen ? (
          <FindInPage
            onRequestFind={(text, forward) => this.c.findInPage(text, { forward })}
            onRequestStopFind={() => {
              this.c.stopFindInPage('clearSelection');
              requestUpdateFindInPageMatches(0, 0);
            }}
          />
        ) : null}
        <div style={{ height: `calc(100vh - ${usedHeight}px)`, width: '100%' }}>
          <WebView
            ref={(c) => { this.c = c; }}
            src={url}
            style={{ height: '100%', width: '100%' }}
            className="webview"
            plugins
            allowpopups
            autoresize
            preload={remote.require('path').join(remote.app.getAppPath(), 'app', 'preload.js')}
            // enable nodeintegration in testing mode (mainly for Spectron)
            nodeintegration={appInfo.isTesting}
            useragent={appInfo.userAgent}
            partition={`persist:${appInfo.id}`}
            onDidGetRedirectRequest={this.handleDidGetRedirectRequest}
            onNewWindow={this.handleNewWindow}
            onDidStartLoading={() => requestUpdateLoading(true)}
            onDidStopLoading={this.handleDidStopLoading}
            onFoundInPage={({ result }) => {
              requestUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches);
            }}
            onPageTitleUpdated={this.handlePageTitleUpdated}
            onUpdateTargetUrl={this.handleUpdateTargetUrl}
          />
        </div>
        <div
          style={{
            position: 'fixed',
            zIndex: 1000,
            bottom: 0,
            left: 0,
            backgroundColor: '#CED9E0',
            lineHeight: '20px',
            fontSize: 12,
            padding: '0 12px',
            borderRadius: 2,
          }}
        >
          {targetUrl}
        </div>
        <Settings />
      </div>
    );
  }
}

App.propTypes = {
  url: React.PropTypes.string,
  findInPageIsOpen: React.PropTypes.bool,
  findInPageText: React.PropTypes.string,
  isFullScreen: React.PropTypes.bool,
  customHome: React.PropTypes.string,
  targetUrl: React.PropTypes.string,
  onResize: React.PropTypes.func,
  requestUpdateTargetUrl: React.PropTypes.func,
  requestUpdateLoading: React.PropTypes.func,
  requestUpdateCanGoBack: React.PropTypes.func,
  requestUpdateCanGoForward: React.PropTypes.func,
  requestToggleSettingDialog: React.PropTypes.func,
  requestToggleFindInPageDialog: React.PropTypes.func,
  requestUpdateFindInPageMatches: React.PropTypes.func,
};

const mapStateToProps = state => ({
  findInPageIsOpen: state.findInPage.get('isOpen'),
  findInPageText: state.findInPage.get('text'),
  isFullScreen: state.screen.get('isFullScreen'),
  customHome: state.settings.getIn(['behaviors', 'customHome']),
  targetUrl: state.nav.get('targetUrl'),
});

const mapDispatchToProps = dispatch => ({
  onResize: () => {
    dispatch(screenResize({
      screenWidth: window.innerWidth,
      isFullScreen: remote.getCurrentWindow().isFullScreen(),
      isMaximized: remote.getCurrentWindow().isMaximized(),
      isMinimized: remote.getCurrentWindow().isMinimized(),
    }));
  },
  requestUpdateTargetUrl: (targetUrl) => {
    dispatch(updateTargetUrl(targetUrl));
  },
  requestUpdateLoading: (isLoading) => {
    dispatch(updateLoading(isLoading));
  },
  requestUpdateCanGoBack: (canGoBack) => {
    dispatch(updateCanGoBack(canGoBack));
  },
  requestUpdateCanGoForward: (canGoForward) => {
    dispatch(updateCanGoForward(canGoForward));
  },
  requestToggleSettingDialog: () => {
    dispatch(toggleSettingDialog());
  },
  requestToggleFindInPageDialog: () => {
    dispatch(toggleFindInPageDialog());
  },
  requestUpdateFindInPageMatches: (activeMatch, matches) => {
    dispatch(updateFindInPageMatches(activeMatch, matches));
  },
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
