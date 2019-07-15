/* global ipcRenderer */
import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import grey from '@material-ui/core/colors/grey';

import connectComponent from '../../helpers/connect-component';
import extractDomain from '../../helpers/extract-domain';

import {
  openFindInPageDialog,
  updateFindInPageMatches,
} from '../../state/root/find-in-page/actions';

import { screenResize } from '../../state/root/screen/actions';

import {
  getWebViewPreloadPath,
  requestOpenInBrowser,
  setBadge,
  writeToClipboard,
} from '../../senders/generic';

import { requestSetPreference } from '../../senders/preferences';

import UpdaterMessage from './updater-message';
import EnhancedSnackbar from './enhanced-snackbar';
import FindInPage from './find-in-page';
import Loading from './loading';
import NavigationBar from './navigation-bar';
import NoConnection from './no-connection';
import TargetUrlBar from './target-url-bar';
import WebView from './web-view';

const styles = theme => ({
  hidden: {
    display: 'none !important',
  },
  rootParent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  root: {
    flex: 1,
    display: 'flex',
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
    position: 'relative',
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
    this.onDidStopLoading = this.onDidStopLoading.bind(this);
    this.onNewWindow = this.onNewWindow.bind(this);

    this.onCopyUrl = this.onCopyUrl.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
    this.onGoHome = this.onGoHome.bind(this);
    this.onReload = this.onReload.bind(this);
    this.onSetZoomFactor = this.onSetZoomFactor.bind(this);
    this.onToggleDevTools = this.onToggleDevTools.bind(this);
    this.isWebViewValid = this.isWebViewValid.bind(this);

    this.state = {
      canGoBack: false,
      canGoForward: false,
      isFailed: false,
      isLoading: true,
      targetUrl: null,
    };
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

    window.addEventListener('focus', () => {
      if (this.isWebViewValid()) {
        this.webView.focus();
      }
    });

    ipcRenderer.on('toggle-dev-tools', onToggleDevTools);

    ipcRenderer.on('open-find-in-page-dialog', () => {
      this.props.onOpenFindInPageDialog();
      // const find = this.webView.findInPage;
      // find.select();
    });

    ipcRenderer.on('find-in-page-next', () => {
      this.props.onOpenFindInPageDialog();
      if (this.isWebViewValid()) {
        const c = this.webView;
        c.findInPage(this.props.findInPageText, { forward: true });
      }
    });

    ipcRenderer.on('find-in-page-previous', () => {
      this.props.onOpenFindInPageDialog();
      if (this.isWebViewValid()) {
        const c = this.webView;
        c.findInPage(this.props.findInPageText, { forward: false });
      }
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

    if (this.isWebViewValid()) {
      // Restart search if text is available
      if (findInPageIsOpen && findInPageText.length > 0) {
        this.webView.findInPage(findInPageText, { forward: true });
      }
    }
  }

  componentWillUnmount() {
    const { onScreenResize } = this.props;
    window.removeEventListener('resize', onScreenResize);
  }

  onDidFailLoad(e) {
    // errorCode -3: cancelling
    // eslint-disable-next-line
    console.log('Error: ', e);
    if (e.isMainFrame && e.errorCode < 0 && e.errorCode !== -3) {
      this.setState({
        isFailed: true,
      });
    }
  }

  onDidStopLoading() {
    const c = this.webView;

    this.setState({
      isLoading: false,
      canGoBack: c.canGoBack(),
      canGoForward: c.canGoForward(),
    });

    requestSetPreference('lastPage', c.getURL());
  }

  onNewWindow(e) {
    const { blockPopup, url } = this.props;
    if (blockPopup) {
      e.preventDefault();
      return;
    }

    const nextUrl = e.url;

    const c = this.webView;

    // eslint-disable-next-line
    console.log(`newWindow: ${nextUrl}`);
    // open external url in browser if domain doesn't match.
    const curDomain = extractDomain(url);
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
      // https://github.com/webcatalog/juli/issues/35
      c.loadURL(nextUrl);
      return;
    }

    // open in browser
    requestOpenInBrowser(nextUrl);
  }

  onToggleDevTools() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      if (c.isDevToolsOpened()) {
        c.closeDevTools();
      } else {
        c.openDevTools();
      }
    }
  }

  onSetZoomFactor(factor) {
    if (this.isWebViewValid()) {
      const c = this.webView;
      c.setZoomFactor(factor);
    }
  }

  onReload() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      c.reload();
    }
  }

  onGoHome() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      const { homePage } = this.props;

      let homeUrl = 'https://google.com';
      if (homePage && homePage.length > 1) {
        homeUrl = homePage;
      }

      c.loadURL(homeUrl);
    }
  }

  onGoBack() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      c.goBack();
    }
  }

  onGoForward() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      c.goForward();
    }
  }


  onCopyUrl() {
    if (this.isWebViewValid()) {
      const c = this.webView;
      const currentURL = c.getURL();
      writeToClipboard(currentURL);
    }
  }

  isWebViewValid() {
    return this.webView && this.webView.isReady();
  }

  render() {
    const {
      classes,
      customUserAgent,
      findInPageIsOpen,
      hidden,
      isFullScreen,
      notPersistCookies,
      onUpdateFindInPageMatches,
      showNavigationBar,
      url,
      id,
      activeWorkspaceId,
    } = this.props;

    const {
      isFailed,
      isLoading,
    } = this.state;

    const {
      onDidStopLoading,
      onDidFailLoad,
      onNewWindow,

      onGoBack,
      onGoForward,
      onGoHome,
      onReload,
    } = this;

    const navElement = !isFullScreen && showNavigationBar && (
      <NavigationBar
        canGoBack={this.state.canGoBack}
        canGoForward={this.state.canGoForward}
        onHomeButtonClick={onGoHome}
        onBackButtonClick={onGoBack}
        onForwardButtonClick={onGoForward}
        onRefreshButtonClick={onReload}
      />
    );

    // remove Electron to prevent some apps to call private Electron APIs.
    const userAgent = window.navigator.userAgent
      .replace(`Electron/${window.versions.electron}`, `Molecule/${window.packageJson.version}`) || customUserAgent;

    return (
      <div
        className={classnames(
          classes.rootParent,
          hidden && classes.hidden,
        )}
      >
        <div className={classes.root}>
          {isFailed && (
            <NoConnection
              onTryAgainButtonClick={() => {
                this.setState({
                  isFailed: false,
                });
                const c = this.webView;
                c.reload();
              }}
            />
          )}
          <div className={classes.rightContent}>
            {navElement}
            {isLoading && <Loading />}
            {findInPageIsOpen && id === activeWorkspaceId && (
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
            <UpdaterMessage />
            <WebView
              allowpopups
              autoresize
              className={classes.webview}
              nodeintegration={window.isTesting}
              parentClassName={classes.webviewContainer}
              partition={notPersistCookies ? 'app' : 'persist:app'}
              plugins
              preload={`file://${getWebViewPreloadPath()}`}
              ref={(c) => { this.webView = c; }}
              useragent={userAgent}
              webpreferences="nativeWindowOpen=no"
              src={url}
              onDidFailLoad={onDidFailLoad}
              onDidStartLoading={() => {
                this.setState({
                  isLoading: true,
                });
              }}
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
              onUpdateTargetUrl={(obj) => {
                this.setState({
                  targetUrl: obj.url,
                });
              }}
            />
            <TargetUrlBar url={this.state.targetUrl} />
          </div>
          <EnhancedSnackbar />
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  blockPopup: false,
  customUserAgent: null,
  hidden: false,
  homePage: null,
  isFullScreen: false,
  notPersistCookies: false,
  showNavigationBar: true,
};

App.propTypes = {
  blockPopup: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  customUserAgent: PropTypes.string,
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  homePage: PropTypes.string,
  isFullScreen: PropTypes.bool,
  notPersistCookies: PropTypes.bool,
  onOpenFindInPageDialog: PropTypes.func.isRequired,
  onScreenResize: PropTypes.func.isRequired,
  onUpdateFindInPageMatches: PropTypes.func.isRequired,
  showNavigationBar: PropTypes.bool,
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  activeWorkspaceId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  blockPopup: state.preferences.blockPopup,
  customUserAgent: state.preferences.userAgent,
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  homePage: state.preferences.homePage,
  isFullScreen: state.screen.isFullScreen,
  lastPage: state.preferences.lastPage,
  notPersistCookies: state.preferences.notPersistCookies,
  rememberLastPage: state.preferences.rememberLastPage,
  showNavigationBar: state.preferences.showNavigationBar,
  activeWorkspaceId: state.general.workspaceId,
});

const actionCreators = {
  openFindInPageDialog,
  screenResize,
  updateFindInPageMatches,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
