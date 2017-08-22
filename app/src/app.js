/* global ipcRenderer clipboard */
import React from 'react';
import PropTypes from 'prop-types';

import grey from 'material-ui/colors/grey';

import connectComponent from './helpers/connect-component';
import extractDomain from './helpers/extract-domain';

import {
  toggleFindInPageDialog,
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
  requestOpenInBrowser,
} from './senders/generic';

import EnhancedSnackbar from './root/enhanced-snackbar';
import FindInPage from './root/find-in-page';
import NavigationBar from './root/navigation-bar';
import NoConnection from './root/no-connection';
import WebView from './root/web-view';
import Loading from './root/loading';

import DialogClearBrowsingData from './dialogs/clear-browsing-data';
import DialogInjectCSS from './dialogs/inject-css';
import DialogInjectJS from './dialogs/inject-js';
import DialogPreferences from './dialogs/preferences';
import DialogRelaunch from './dialogs/relaunch';
import DialogReset from './dialogs/reset';
import DialogUserAgent from './dialogs/user-agent';

const styles = theme => ({
  root: {
    width: '100vw',
    height: '100vh',
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
    height: '100vh',
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
    // height: '100vh',
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
    const { onScreenResize } = this.props;

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

    ipcRenderer.on('toggle-dev-tools', onToggleDevTools);

    ipcRenderer.on('toggle-find-in-page-dialog', () => {
      if (this.props.findInPageIsOpen) {
        const c = this.webView;
        c.stopFindInPage('clearSelection');
        this.props.onUpdateFindInPageMatches(0, 0);
      }
      this.props.onToggleFindInPageDialog();
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
      // https://github.com/webcatalog/webcatalog/issues/35
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
    c.loadURL(this.props.customHome || window.shellInfo.url);
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
    clipboard.writeText(currentURL);
  }

  render() {
    const {
      classes,
      findInPageIsOpen,
      isFailed,
      isLoading,
      navigationBarPosition,
      showNavigationBar,
      onUpdateFindInPageMatches,
      onUpdateIsFailed,
      onUpdateIsLoading,
      onUpdateTargetUrl,
    } = this.props;

    const {
      onDidStopLoading,
      onDidFailLoad,
      onNewWindow,

      onGoBack,
      onGoForward,
      onGoHome,
      onReload,
    } = this;

    const navElement = showNavigationBar && (
      <NavigationBar
        vert={navigationBarPosition === 'top'}
        onHomeButtonClick={onGoHome}
        onBackButtonClick={onGoBack}
        onForwardButtonClick={onGoForward}
        onRefreshButtonClick={onReload}
      />
    );

    return (
      <div className={classes.root}>
        <DialogClearBrowsingData />
        <DialogInjectCSS />
        <DialogInjectJS />
        <DialogPreferences />
        <DialogRelaunch />
        <DialogReset />
        <DialogUserAgent />

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
            ref={(c) => { this.webView = c; }}
            parentClassName={classes.webviewContainer}
            className={classes.webview}
            plugins
            allowpopups
            autoresize
            partition="persist:app"
            nodeintegration={false}
            webpreferences="nativeWindowOpen=no"
            src={window.shellInfo.url}
            onDidFailLoad={onDidFailLoad}
            onDidStartLoading={() => onUpdateIsLoading(true)}
            onDidStopLoading={onDidStopLoading}
            onFoundInPage={({ result }) =>
              onUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches)}
            onNewWindow={onNewWindow}
            onPageTitleUpdated={({ url, title }) => {
              document.title = title;
              onUpdateTargetUrl(url);

              ipcRenderer.send('set-title', title);

              const itemCountRegex = /[([{](\d*?)[}\])]/;
              const match = itemCountRegex.exec(title);
              const newBadge = match ? match[1] : '';

              ipcRenderer.send('badge', newBadge);
            }}
          />
        </div>
        {navigationBarPosition === 'right' && navElement}
        <EnhancedSnackbar />
      </div>
    );
  }
}

App.defaultProps = {
  customHome: null,
  isFailed: false,
  isFullScreen: false,
  isLoading: false,
  navigationBarPosition: 'left',
  showNavigationBar: true,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  customHome: PropTypes.string,
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  isFailed: PropTypes.bool,
  isLoading: PropTypes.bool,
  navigationBarPosition: PropTypes.oneOf(['left', 'right', 'top']),
  showNavigationBar: PropTypes.bool,
  onScreenResize: PropTypes.func.isRequired,
  onToggleFindInPageDialog: PropTypes.func.isRequired,
  onUpdateCanGoBack: PropTypes.func.isRequired,
  onUpdateCanGoForward: PropTypes.func.isRequired,
  onUpdateFindInPageMatches: PropTypes.func.isRequired,
  onUpdateIsFailed: PropTypes.func.isRequired,
  onUpdateIsLoading: PropTypes.func.isRequired,
  onUpdateTargetUrl: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  isFailed: state.nav.isFailed,
  isFullScreen: state.screen.isFullScreen,
  isLoading: state.nav.isLoading,
  navigationBarPosition: state.preferences.navigationBarPosition,
  showNavigationBar: state.preferences.showNavigationBar,
});

const actionCreators = {
  screenResize,
  updateTargetUrl,
  updateIsFailed,
  updateIsLoading,
  updateCanGoBack,
  updateCanGoForward,
  toggleFindInPageDialog,
  updateFindInPageMatches,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
