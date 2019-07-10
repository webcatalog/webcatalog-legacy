/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';

import grey from 'material-ui/colors/grey';

import connectComponent from './helpers/connect-component';
import extractDomain from './helpers/extract-domain';

import {
  openFindInPageDialog,
  updateFindInPageMatches,
} from './state/root/find-in-page/actions';

import {
  updateCanGoBack,
  updateCanGoForward,
  updateIsFailed,
  updateIsLoading,
  updateTargetUrl,
} from './state/root/nav/actions';

import { screenResize } from './state/root/screen/actions';

import {
  getWebViewPreloadPath,
  requestOpenInBrowser,
  setBadge,
  writeToClipboard,
} from './senders/generic';

import { requestSetPreference } from './senders/preferences';

import FakeTitleBar from './shared/fake-title-bar';

import EnhancedSnackbar from './root/enhanced-snackbar';
import FindInPage from './root/find-in-page';
import Loading from './root/loading';
import NavigationBar from './root/navigation-bar';
import NoConnection from './root/no-connection';
import TargetUrlBar from './root/target-url-bar';
import WebView from './root/web-view';

import DialogAbout from './dialogs/about';
import DialogClearBrowsingData from './dialogs/clear-browsing-data';
import DialogHomePage from './dialogs/home-page';
import DialogInjectCSS from './dialogs/inject-css';
import DialogInjectJS from './dialogs/inject-js';
import DialogPreferences from './dialogs/preferences';
import DialogProxyRules from './dialogs/proxy-rules';
import DialogRelaunch from './dialogs/relaunch';
import DialogReset from './dialogs/reset';
import DialogUserAgent from './dialogs/user-agent';

const styles = theme => ({
  rootParent: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    flex: 1,
    display: 'flex',
  },
  leftNav: {
    backgroundColor: theme.palette.background.default,
    flexBasis: 88,
    width: 88,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  leftNavBlank: {
    height: window.platform === 'darwin' ? theme.spacing.unit * 4 : theme.spacing.unit,
  },
  leftNavBlankFullScreen: {
    height: theme.spacing.unit,
  },
  rightContent: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  webNavContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    padding: theme.spacing.unit,
    boxSizing: 'border-box',
    borderTop: `1px solid ${grey[500]}`,
  },
  webNavIconButtonRoot: {
    height: 28,
    width: 28,
  },
  webNavIconButtonIcon: {
    height: 20,
    width: 20,
  },
  webviewContainer: {
    flex: 1,
    display: 'flex',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.onDidFailLoad = this.onDidFailLoad.bind(this);
    this.onDidGetRedirectRequest = this.onDidGetRedirectRequest.bind(this);
    this.onDidStopLoading = this.onDidStopLoading.bind(this);
    this.onNewWindow = this.onNewWindow.bind(this);

    this.onCopyUrl = this.onCopyUrl.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
    this.onGoHome = this.onGoHome.bind(this);
    this.onReload = this.onReload.bind(this);
    this.onSetZoomFactor = this.onSetZoomFactor.bind(this);
    this.onToggleDevTools = this.onToggleDevTools.bind(this);
  }

  componentDidMount() {
    const {
      onScreenResize,
    } = this.props;

    const {
      onCopyUrl,
      onGoBack,
      onGoForward,
      onGoHome,
      onReload,
      onSetZoomFactor,
      onToggleDevTools,
    } = this;

    window.addEventListener('resize', onScreenResize);

    window.addEventListener('focus', () => this.webView.focus());

    ipcRenderer.on('toggle-dev-tools', onToggleDevTools);

    ipcRenderer.on('open-find-in-page-dialog', () => {
      this.props.onOpenFindInPageDialog();
      const find = this.findInPage;
      find.select();
    });

    ipcRenderer.on('find-in-page-next', () => {
      this.props.onOpenFindInPageDialog();
      const c = this.webView;
      c.findInPage(this.props.findInPageText, { forward: true });
    });

    ipcRenderer.on('find-in-page-previous', () => {
      this.props.onOpenFindInPageDialog();
      const c = this.webView;
      c.findInPage(this.props.findInPageText, { forward: false });
    });

    ipcRenderer.on('change-zoom', (event, factor) => onSetZoomFactor(factor));

    ipcRenderer.on('reload', onReload);

    ipcRenderer.on('go-back', onGoBack);

    ipcRenderer.on('go-forward', onGoForward);

    ipcRenderer.on('go-home', onGoHome);

    ipcRenderer.on('copy-url', onCopyUrl);
  }

  componentDidUpdate() {
    const {
      findInPageIsOpen,
      findInPageText,
    } = this.props;

    const c = this.webView;

    // Restart search if text is available
    if (findInPageIsOpen && findInPageText.length > 0) {
      c.findInPage(findInPageText, { forward: true });
    }
  }

  componentWillUnmount() {
    const { onScreenResize } = this.props;
    window.removeEventListener('resize', onScreenResize);
  }

  onDidFailLoad(e) {
    const { onUpdateIsFailed } = this.props;

    // errorCode -3: cancelling
    // eslint-disable-next-line
    console.log('Error: ', e);
    if (e.isMainFrame && e.errorCode < 0 && e.errorCode !== -3) {
      onUpdateIsFailed(true);
    }
  }

  // https://github.com/electron/electron/issues/3471#issuecomment-323139653
  onDidGetRedirectRequest(e) {
    // only do this with Twitter
    // https://github.com/quanglam2807/webcatalog-apps/tree/master/apps/twitter
    if (window.shellInfo.id !== 'twitter') {
      return;
    }

    const c = this.webView;

    setTimeout(() => {
      c.executeJavaScript([
        'window.onbeforeunload = function(event){',
        'console.log(event);',
        'return \'Are you sure you want to leave?\';',
        '};',
        `window.location = '${e.newURL}';`,
      ].join(''));
    }, 10);
    e.preventDefault();
  }

  onDidStopLoading() {
    const {
      onUpdateIsLoading,
      onUpdateCanGoBack,
      onUpdateCanGoForward,
    } = this.props;

    const c = this.webView;

    onUpdateIsLoading(false);
    onUpdateCanGoBack(c.canGoBack());
    onUpdateCanGoForward(c.canGoForward());

    requestSetPreference('lastPage', c.getURL());
  }

  onNewWindow(e) {
    const nextUrl = e.url;

    const c = this.webView;

    // eslint-disable-next-line
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

    e.preventDefault();

    // navigate
    if (nextDomain && (nextDomain === curDomain || nextDomain === 'accounts.google.com')) {
      // https://github.com/webcatalog/appifier/issues/35
      c.loadURL(nextUrl);
      return;
    }

    // open in browser
    requestOpenInBrowser(nextUrl);
  }

  onToggleDevTools() {
    const c = this.webView;
    if (c.isDevToolsOpened()) {
      c.closeDevTools();
    } else {
      c.openDevTools();
    }
  }

  onSetZoomFactor(factor) {
    const c = this.webView;
    c.setZoomFactor(factor);
  }

  onReload() {
    const c = this.webView;
    c.reload();
  }

  onGoHome() {
    const c = this.webView;
    const { homePage } = this.props;

    let homeUrl = window.shellInfo.url;
    if (homePage && homePage.length > 1) {
      homeUrl = homePage;
    }

    c.loadURL(homeUrl);
  }

  onGoBack() {
    const c = this.webView;
    c.goBack();
  }

  onGoForward() {
    const c = this.webView;
    c.goForward();
  }


  onCopyUrl() {
    const c = this.webView;
    const currentURL = c.getURL();
    writeToClipboard(currentURL);
  }

  render() {
    const {
      classes,
      customUserAgent,
      findInPageIsOpen,
      homePage,
      isFailed,
      isFullScreen,
      isLoading,
      lastPage,
      navigationBarPosition,
      onUpdateFindInPageMatches,
      onUpdateIsFailed,
      onUpdateIsLoading,
      onUpdateTargetUrl,
      rememberLastPage,
      showNavigationBar,
      showTitleBar,
    } = this.props;

    const {
      onDidStopLoading,
      onDidGetRedirectRequest,
      onDidFailLoad,
      onNewWindow,

      onGoBack,
      onGoForward,
      onGoHome,
      onReload,
    } = this;

    const navElement = !isFullScreen && showNavigationBar && (
      <NavigationBar
        onHomeButtonClick={onGoHome}
        onBackButtonClick={onGoBack}
        onForwardButtonClick={onGoForward}
        onRefreshButtonClick={onReload}
      />
    );

    // remove Electron to prevent some apps to call private Electron APIs.
    const userAgent = window.navigator.userAgent
      .replace(`Electron/${window.versions.electron}`, `Molecule/${window.packageJson.version}`) || customUserAgent;

    // force user to have title bar if they hide navigation bar
    const shouldShowTitleBar = !isFullScreen && showTitleBar;

    let startUrl = window.shellInfo.url;
    if (homePage && homePage.length > 1) {
      startUrl = homePage;
    }
    if (rememberLastPage && lastPage) {
      startUrl = lastPage;
    }

    return (
      <div className={classes.rootParent}>
        <DialogAbout />
        <DialogClearBrowsingData />
        <DialogHomePage />
        <DialogInjectCSS />
        <DialogInjectJS />
        <DialogPreferences />
        <DialogProxyRules />
        <DialogRelaunch />
        <DialogReset />
        <DialogUserAgent />

        {shouldShowTitleBar && (
          <FakeTitleBar background="-webkit-linear-gradient(top, #ebebeb, #d5d5d5)" />
        )}

        <div className={classes.root}>
          {navigationBarPosition === 'left' && navElement}
          {isFailed && (
            <NoConnection
              onTryAgainButtonClick={() => {
                onUpdateIsFailed(false);
                const c = this.webView;
                c.reload();
              }}
            />
          )}
          <div className={classes.rightContent}>
            {isLoading && <Loading />}
            {navigationBarPosition === 'top' && navElement}
            {findInPageIsOpen && (
              <FindInPage
                inputRef={(find) => { this.findInPage = find; }}
                onRequestFind={(text, forward) => {
                  const c = this.webView;
                  c.findInPage(text, { forward });
                }}
                onRequestStopFind={() => {
                  const c = this.webView;
                  c.stopFindInPage('clearSelection');
                  onUpdateFindInPageMatches(0, 0);
                }}
              />
            )}
            <WebView
              allowpopups
              autoresize
              className={classes.webview}
              nodeintegration={false}
              parentClassName={classes.webviewContainer}
              partition="persist:app"
              plugins
              preload={`file://${getWebViewPreloadPath()}`}
              ref={(c) => { this.webView = c; }}
              useragent={userAgent}
              webpreferences="nativeWindowOpen=no"
              src={startUrl}
              onDidFailLoad={onDidFailLoad}
              onDidStartLoading={() => onUpdateIsLoading(true)}
              onDidStopLoading={onDidStopLoading}
              onFoundInPage={({ result }) =>
                onUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches)}
              onNewWindow={onNewWindow}
              onPageTitleUpdated={({ title }) => {
                document.title = title;

                ipcRenderer.send('set-title', title);

                const itemCountRegex = /[([{](\d*?)[}\])]/;
                const match = itemCountRegex.exec(title);
                const newBadge = match ? match[1] : '';

                setBadge(newBadge);
              }}
              onUpdateTargetUrl={({ url }) => {
                onUpdateTargetUrl(url);
              }}
              onDidGetRedirectRequest={onDidGetRedirectRequest}
            />
            <TargetUrlBar />
          </div>
          {navigationBarPosition === 'right' && navElement}
          <EnhancedSnackbar />
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  customUserAgent: null,
  homePage: null,
  isFailed: false,
  isFullScreen: false,
  isLoading: false,
  lastPage: null,
  navigationBarPosition: 'left',
  rememberLastPage: false,
  showNavigationBar: true,
  showTitleBar: false,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  customUserAgent: PropTypes.string,
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  homePage: PropTypes.string,
  isFailed: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  isLoading: PropTypes.bool,
  lastPage: PropTypes.string,
  navigationBarPosition: PropTypes.oneOf(['left', 'right', 'top']),
  onOpenFindInPageDialog: PropTypes.func.isRequired,
  onScreenResize: PropTypes.func.isRequired,
  onUpdateCanGoBack: PropTypes.func.isRequired,
  onUpdateCanGoForward: PropTypes.func.isRequired,
  onUpdateFindInPageMatches: PropTypes.func.isRequired,
  onUpdateIsFailed: PropTypes.func.isRequired,
  onUpdateIsLoading: PropTypes.func.isRequired,
  onUpdateTargetUrl: PropTypes.func.isRequired,
  rememberLastPage: PropTypes.bool,
  showNavigationBar: PropTypes.bool,
  showTitleBar: PropTypes.bool,
};

const mapStateToProps = state => ({
  customUserAgent: state.preferences.userAgent,
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  homePage: state.preferences.homePage,
  isFailed: state.nav.isFailed,
  isFullScreen: state.screen.isFullScreen,
  isLoading: state.nav.isLoading,
  lastPage: state.preferences.lastPage,
  navigationBarPosition: state.preferences.navigationBarPosition,
  rememberLastPage: state.preferences.rememberLastPage,
  showNavigationBar: state.preferences.showNavigationBar,
  showTitleBar: state.preferences.showTitleBar,
});

const actionCreators = {
  screenResize,
  openFindInPageDialog,
  updateCanGoBack,
  updateCanGoForward,
  updateFindInPageMatches,
  updateIsFailed,
  updateIsLoading,
  updateTargetUrl,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
