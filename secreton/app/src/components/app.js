/* global ipcRenderer */

import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import ArrowForwardIcon from 'material-ui-icons/ArrowForward';
import RefreshIcon from 'material-ui-icons/Refresh';
import { LinearProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';

import SearchBox from './search-box';
import WebView from './web-view';
import FindInPage from './find-in-page';
import EnhancedSnackbar from './enhanced-snack-bar';
import DialogAbout from './dialog-about';
import NoConnection from './no-connection';

import { screenResize } from '../state/root/screen/actions';

import {
  toggleFindInPageDialog,
  updateFindInPageMatches,
} from '../state/root/find-in-page/actions';

import {
  updateCanGoBack,
  updateCanGoForward,
  updateCurrentUrl,
  updateIsFailed,
  updateIsLoading,
  updateTargetUrl,
} from '../state/root/nav/actions';

import {
  getHomePath,
  getWebViewPreloadPath,
  requestErase,
  writeToClipboard,
} from '../senders/generic';

import {
  STRING_BACK,
  STRING_FORWARD,
  STRING_RELOAD_CURRENT_PAGE,
} from '../constants/strings';

const styles = {
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  toolbar: {
    minHeight: 36,
    paddingLeft: 68,
  },
  iconButton: {
    height: 32,
    width: 32,
  },
  button: {
    height: 32,
    minHeight: 32,
  },
  webviewContainer: {
    flex: 1,
    display: 'flex',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
  linearProgress: {
    position: 'absolute',
    top: 36,
    left: 0,
    width: '100vw',
  },
};

const homePath = `file://${getHomePath()}`;

class App extends React.Component {
  constructor() {
    super();
    this.onDidFailLoad = this.onDidFailLoad.bind(this);
    this.onDidStopLoading = this.onDidStopLoading.bind(this);
    this.onNewWindow = this.onNewWindow.bind(this);

    this.onCopyUrl = this.onCopyUrl.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onGoForward = this.onGoForward.bind(this);
    this.onReload = this.onReload.bind(this);
    this.onReset = this.onReset.bind(this);
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
      onReload,
      onReset,
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

    ipcRenderer.on('erase-finished', onReset);

    ipcRenderer.on('go-back', onGoBack);

    ipcRenderer.on('go-forward', onGoForward);

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
      onUpdateCanGoBack,
      onUpdateCanGoForward,
      onUpdateCurrentUrl,
      onUpdateIsLoading,
    } = this.props;

    const c = this.webView;

    onUpdateIsLoading(false);
    onUpdateCanGoBack(c.canGoBack());
    onUpdateCanGoForward(c.canGoForward());

    const currentURL = c.getURL();
    onUpdateCurrentUrl(currentURL);
  }

  onNewWindow(e) {
    e.preventDefault();

    this.webView.loadURL(e.url);
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
    const { currentUrl } = this.props;

    if (!currentUrl) return;

    const c = this.webView;
    c.reload();
  }

  onReset() {
    const c = this.webView;
    c.clearHistory();
    c.loadURL(homePath);
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
      findInPageIsOpen,
      isFailed,
      isLoading,
      canGoBack,
      canGoForward,
      currentUrl,
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
      onReload,
    } = this;

    return (
      <div className={classes.root}>
        <AppBar position="static" elevation="0" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              aria-label={STRING_BACK}
              className={classes.iconButton}
              color="contrast"
              disabled={!canGoBack}
              onClick={onGoBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              aria-label={STRING_FORWARD}
              className={classes.iconButton}
              color="contrast"
              disabled={!canGoForward}
              onClick={onGoForward}
            >
              <ArrowForwardIcon />
            </IconButton>
            <IconButton
              aria-label={STRING_RELOAD_CURRENT_PAGE}
              className={classes.iconButton}
              color="contrast"
              disabled={Boolean(!currentUrl || currentUrl === homePath)}
              onClick={onReload}
            >
              <RefreshIcon />
            </IconButton>
            <SearchBox onLoadURL={url => this.webView.loadURL(url)} />
            {!(currentUrl === homePath) && (
              <Button
                className={classes.button}
                onClick={() => requestErase()}
              >
                Erase
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {isLoading && <LinearProgress color="accent" className={classes.linearProgress} />}
        {isFailed && (
          <NoConnection
            onTryAgainButtonClick={() => {
              onUpdateIsFailed(false);
              const c = this.webView;
              c.reload();
            }}
          />
        )}
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
          allowpopups
          autoresize
          className={classes.webview}
          nodeintegration={false}
          parentClassName={classes.webviewContainer}
          partition="app"
          plugins
          src={homePath}
          preload={`file://${getWebViewPreloadPath()}`}
          ref={(c) => { this.webView = c; }}
          webpreferences="nativeWindowOpen=no"
          onDidFailLoad={onDidFailLoad}
          onDidStartLoading={() => {
            onUpdateIsLoading(true);
            onUpdateIsFailed(false);
          }}
          onDidStopLoading={onDidStopLoading}
          onFoundInPage={({ result }) =>
            onUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches)}
          onNewWindow={onNewWindow}
          onUpdateTargetUrl={({ url }) => {
            onUpdateTargetUrl(url);
          }}
        />
        <EnhancedSnackbar />
        <DialogAbout />
      </div>
    );
  }
}

App.defaultProps = {
  canGoBack: false,
  canGoForward: false,
  currentUrl: null,
  isFailed: false,
  isLoading: false,
};

App.propTypes = {
  isFailed: PropTypes.bool,
  isLoading: PropTypes.bool,
  canGoBack: PropTypes.bool,
  canGoForward: PropTypes.bool,
  currentUrl: PropTypes.string,
  classes: PropTypes.object.isRequired,
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  onScreenResize: PropTypes.func.isRequired,
  onToggleFindInPageDialog: PropTypes.func.isRequired,
  onUpdateCanGoBack: PropTypes.func.isRequired,
  onUpdateCanGoForward: PropTypes.func.isRequired,
  onUpdateCurrentUrl: PropTypes.func.isRequired,
  onUpdateFindInPageMatches: PropTypes.func.isRequired,
  onUpdateIsFailed: PropTypes.func.isRequired,
  onUpdateIsLoading: PropTypes.func.isRequired,
  onUpdateTargetUrl: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  canGoBack: state.nav.canGoBack,
  canGoForward: state.nav.canGoForward,
  currentUrl: state.nav.currentUrl,
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  isFailed: state.nav.isFailed,
  isFullScreen: state.screen.isFullScreen,
  isLoading: state.nav.isLoading,
});

const actionCreators = {
  screenResize,
  toggleFindInPageDialog,
  updateCanGoBack,
  updateCanGoForward,
  updateCurrentUrl,
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
