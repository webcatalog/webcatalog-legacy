/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NonIdealState, Button, Intent, Classes, Hotkey, Hotkeys, HotkeysTarget } from '@blueprintjs/core';

import Immutable from 'immutable';

import extractDomain from '../libs/extractDomain';
import {
  updateTargetUrl,
  updateIsFailed,
  updateIsLoading,
  updateCanGoBack,
  updateCanGoForward,
} from '../actions/nav';
import { toggleSettingDialog } from '../actions/settings';
import { toggleFindInPageDialog, updateFindInPageMatches } from '../actions/findInPage';
import { screenResize } from '../actions/screen';
import {
  addTab,
  setActiveTab,
  setTabLastURL,
} from '../actions/tabs';

import LeftNav from './LeftNav';
import WebView from './WebView';
import Settings from './Settings';
import Nav from './Nav';
import FindInPage from './FindInPage';
import showUpdateToast from '../../shared/components/showUpdateToast';

@HotkeysTarget
class App extends React.Component {
  constructor() {
    super();
    this.handleNewWindow = this.handleNewWindow.bind(this);
    this.handleDidFailLoad = this.handleDidFailLoad.bind(this);
    this.handleDidStopLoading = this.handleDidStopLoading.bind(this);
    this.handleDidGetRedirectRequest = this.handleDidGetRedirectRequest.bind(this);
    this.handleUpdateTargetUrl = this.handleUpdateTargetUrl.bind(this);

    this.c = {};
  }

  componentDidMount() {
    const {
      activeTab,
      requestToggleSettingDialog,
      requestToggleFindInPageDialog,
      requestUpdateFindInPageMatches,
      onResize,
    } = this.props;

    const c = this.c[activeTab];

    showUpdateToast();

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
      c.loadURL(this.props.customHome || window.shellInfo.url);
    });

    ipcRenderer.on('go-to-url', (e, url) => {
      c.loadURL(url);
    });

    ipcRenderer.on('copy-url', () => {
      const currentURL = c.getURL();
      clipboard.writeText(currentURL);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      activeTab,
      findInPageIsOpen,
      findInPageText,
    } = this.props;

    const c = this.c[activeTab];

    // Restart search if text is available
    if (findInPageIsOpen && findInPageText.length > 0) {
      c.findInPage(findInPageText, { forward: true });
    }

    if (prevProps.activeTab !== activeTab) {
      this.c[prevProps.activeTab].c.style.display = 'none';
      this.c[activeTab].c.style.display = null;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onResize);
  }

  handleDidGetRedirectRequest(e) {
    const {
      activeTab,
    } = this.props;

    const c = this.c[activeTab];

    const { newURL, isMainFrame } = e;
    // https://github.com/webcatalog/webcatalog/issues/42
    if (isMainFrame && extractDomain(newURL) === 'twitter.com') {
      setTimeout(() => c.loadURL(newURL), 100);
      e.preventDefault();
    }
  }

  handleNewWindow(e) {
    const { activeTab } = this.props;

    const nextUrl = e.url;

    const c = this.c[activeTab];

    console.log(`newWindow: ${nextUrl}`);
    // open external url in browser if domain doesn't match.
    const curDomain = extractDomain(window.shellInfo.url);
    const nextDomain = extractDomain(nextUrl);

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
    ipcRenderer.send('open-in-browser', nextUrl);
  }

  handleDidFailLoad(e) {
    // errorCode -3: cancelling
    console.log('Error: ', e);
    if (e.isMainFrame && e.errorCode < 0 && e.errorCode !== -3) {
      const { requestUpdateIsFailed } = this.props;
      requestUpdateIsFailed(true);
    }
  }

  handleDidStopLoading() {
    const {
      activeTab,
      requestUpdateIsLoading,
      requestUpdateCanGoBack,
      requestUpdateCanGoForward,
      requestSetTabLastUrl,
    } = this.props;

    const c = this.c[activeTab];

    requestUpdateIsLoading(false);
    requestUpdateCanGoBack(c.canGoBack());
    requestUpdateCanGoForward(c.canGoForward());

    requestSetTabLastUrl(activeTab, c.getURL());
  }

  handlePageTitleUpdated({ title }) {
    ipcRenderer.send('set-title', title);

    const itemCountRegex = /[([{](\d*?)[}\])]/;
    const match = itemCountRegex.exec(title);
    const newBadge = match ? match[1] : '';

    ipcRenderer.send('badge', newBadge);
  }

  handleUpdateTargetUrl({ url }) {
    const { requestUpdateTargetUrl } = this.props;
    requestUpdateTargetUrl(url);
  }

  renderHotkeys() {
    const {
      tabs,
      requestAddTab,
      requestSetActiveTab,
    } = this.props;

    return (
      <Hotkeys>
        {tabs.map((tab, tabIndex) => (
          <Hotkey
            key={tab.hashCode()}
            global
            combo={`mod + ${tabIndex + 1}`}
            label={`Tab ${tabIndex + 1}`}
            onKeyDown={() => {
              requestSetActiveTab(tabIndex);
            }}
          />
        ))}
        <Hotkey
          key="newTabHotKey"
          global
          combo="mod + t"
          label="New Tab"
          onKeyDown={() => {
            requestAddTab();
          }}
        />
      </Hotkeys>
    );
  }

  render() {
    const {
      findInPageIsOpen,
      isFailed,
      isFullScreen,
      customHome,
      rememberLastPage,
      tabs,
      activeTab,
      requestUpdateIsFailed,
      requestUpdateIsLoading,
      requestUpdateFindInPageMatches,
      targetUrl,
    } = this.props;

    const showNav = process.platform === 'darwin' && !isFullScreen;

    let usedHeight = showNav ? 32 : 0;
    if (findInPageIsOpen) usedHeight += 50;

    return (
      <div
        style={{
          height: '100vh',
        }}
      >
        {isFailed ? (
          <div
            style={{
              height: '100vh',
              width: '100vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NonIdealState
              visual="error"
              className="no-connection"
              title="Internet Connection"
              description="Please check your Internet connection and try again."
              action={(
                <Button
                  iconName="repeat"
                  intent={Intent.PRIMARY}
                  className={Classes.LARGE}
                  text="Try Again"
                  onClick={() => {
                    requestUpdateIsFailed(false);
                    this.c.reload();
                  }}
                />
              )}
            />
          </div>
        ) : null}
        {showNav ? (
          <Nav
            onHomeButtonClick={() => {
              const c = this.c[activeTab];
              c.loadURL(customHome || window.shellInfo.url);
            }}
            onBackButtonClick={() => {
              const c = this.c[activeTab];
              c.goBack();
            }}
            onForwardButtonClick={() => {
              const c = this.c[activeTab];
              c.goForward();
            }}
            onRefreshButtonClick={() => {
              const c = this.c[activeTab];
              c.reload();
            }}
          />
        ) : null}
        {findInPageIsOpen ? (
          <FindInPage
            onRequestFind={(text, forward) => {
              const c = this.c[activeTab];
              c.findInPage(text, { forward });
            }}
            onRequestStopFind={() => {
              const c = this.c[activeTab];
              c.stopFindInPage('clearSelection');
              requestUpdateFindInPageMatches(0, 0);
            }}
          />
        ) : null}
        <div style={{ height: `calc(100vh - ${usedHeight}px)`, width: '100vw', display: 'flex' }}>
          <LeftNav />
          <div style={{ height: `calc(100vh - ${usedHeight}px)`, width: '100%' }}>
            {tabs.map((tab, tabIndex) => (
              <WebView
                key={tab.get('createdAt')}
                ref={(c) => { this.c[tabIndex] = c; }}
                src={rememberLastPage ? (tab.get('lastUrl') || customHome || window.shellInfo.url) : (customHome || window.shellInfo.url)}
                style={{ height: '100%', width: '100%', display: !tab.get('isActive') ? 'none' : null }}
                className="webview"
                plugins
                allowpopups
                autoresize
                preload="../webview_preload.js"
                // enable nodeintegration in testing mode (mainly for Spectron)
                nodeintegration={window.shellInfo.isTesting}
                useragent={window.shellInfo.userAgent}
                partition={`persist:${window.shellInfo.id}_${tab.get('createdAt')}`}
                onDidGetRedirectRequest={this.handleDidGetRedirectRequest}
                onDidFailLoad={this.handleDidFailLoad}
                onNewWindow={this.handleNewWindow}
                onDidStartLoading={() => requestUpdateIsLoading(true)}
                onDidStopLoading={this.handleDidStopLoading}
                onFoundInPage={({ result }) => {
                  requestUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches);
                }}
                onPageTitleUpdated={this.handlePageTitleUpdated}
                onUpdateTargetUrl={this.handleUpdateTargetUrl}
              />
            ))}
          </div>
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
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100vw',
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
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  isFullScreen: PropTypes.bool,
  isFailed: PropTypes.bool,
  customHome: PropTypes.string,
  rememberLastPage: PropTypes.bool,
  targetUrl: PropTypes.string,
  tabs: PropTypes.instanceOf(Immutable.List),
  activeTab: PropTypes.number,
  onResize: PropTypes.func.isRequired,
  requestUpdateTargetUrl: PropTypes.func.isRequired,
  requestUpdateIsFailed: PropTypes.func.isRequired,
  requestUpdateIsLoading: PropTypes.func.isRequired,
  requestUpdateCanGoBack: PropTypes.func.isRequired,
  requestUpdateCanGoForward: PropTypes.func.isRequired,
  requestToggleSettingDialog: PropTypes.func.isRequired,
  requestToggleFindInPageDialog: PropTypes.func.isRequired,
  requestUpdateFindInPageMatches: PropTypes.func.isRequired,
  requestAddTab: PropTypes.func.isRequired,
  requestSetActiveTab: PropTypes.func.isRequired,
  requestSetTabLastUrl: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const tabs = state.tabs.get('list');
  let activeTab = 0;
  tabs.forEach((tab, tabIndex) => {
    if (tab.get('isActive')) {
      activeTab = tabIndex;
    }
  });


  return {
    findInPageIsOpen: state.findInPage.get('isOpen'),
    findInPageText: state.findInPage.get('text'),
    isFullScreen: state.screen.get('isFullScreen'),
    isFailed: state.nav.get('isFailed'),
    customHome: state.settings.getIn(['behaviors', 'customHome']),
    rememberLastPage: state.settings.getIn(['behaviors', 'rememberLastPage']),
    targetUrl: state.nav.get('targetUrl'),
    tabs,
    activeTab,
  };
};

const mapDispatchToProps = dispatch => ({
  onResize: () => dispatch(screenResize(window.innerWidth)),
  requestUpdateTargetUrl: targetUrl => dispatch(updateTargetUrl(targetUrl)),
  requestUpdateIsFailed: isFailed => dispatch(updateIsFailed(isFailed)),
  requestUpdateIsLoading: isLoading => dispatch(updateIsLoading(isLoading)),
  requestUpdateCanGoBack: canGoBack => dispatch(updateCanGoBack(canGoBack)),
  requestUpdateCanGoForward: canGoForward => dispatch(updateCanGoForward(canGoForward)),
  requestToggleSettingDialog: () => dispatch(toggleSettingDialog()),
  requestToggleFindInPageDialog: () => dispatch(toggleFindInPageDialog()),
  requestUpdateFindInPageMatches: (activeMatch, matches) =>
    dispatch(updateFindInPageMatches(activeMatch, matches)),
  requestAddTab: () => dispatch(addTab()),
  requestSetActiveTab: isActive => dispatch(setActiveTab(isActive)),
  requestSetTabLastUrl: (tabIndex, lastUrl) => dispatch(setTabLastURL(tabIndex, lastUrl)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(App);
