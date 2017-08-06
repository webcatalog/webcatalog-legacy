/* global ipcRenderer clipboard */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { grey } from 'material-ui/styles/colors';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import extractDomain from '../utils/extractDomain';

import {
  toggleFindInPageDialog,
  updateFindInPageMatches,
} from '../actions/findInPage';
import {
  updateCanGoBack,
  updateCanGoForward,
  updateIsFailed,
  updateIsLoading,
  updateTargetUrl,
} from '../actions/nav';
import { screenResize } from '../actions/screen';

import WebView from './WebView';
import FindInPage from './FindInPage';
import Navigation from './Navigation';

const styleSheet = createStyleSheet('App', theme => ({
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
    height: window.PLATFORM === 'darwin' ? theme.spacing.unit * 4 : theme.spacing.unit,
  },
  leftNavBlankFullScreen: {
    height: theme.spacing.unit,
  },
  rightContent: {
    flex: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
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
    height: '100vh',
  },
  webview: {
    height: '100%',
    width: '100%',
  },
  errorFullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: grey[300],
    zIndex: 1000,
  },
}));

class App extends React.Component {
  constructor() {
    super();
    this.onDidFailLoad = this.onDidFailLoad.bind(this);
    this.onDidStopLoading = this.onDidStopLoading.bind(this);
    this.onNewWindow = this.onNewWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.handleResize);

    ipcRenderer.on('toggle-dev-tools', () => {
      const c = this.webView;
      c.openDevTools();
    });

    ipcRenderer.on('toggle-find-in-page-dialog', () => {
      if (this.props.findInPageIsOpen) {
        const c = this.webView;
        c.stopFindInPage('clearSelection');
        this.props.handleUpdateFindInPageMatches(0, 0);
      }
      this.props.handleToggleFindInPageDialog();
    });

    ipcRenderer.on('change-zoom', (event, message) => {
      const c = this.webView;
      c.setZoomFactor(message);
    });

    ipcRenderer.on('reload', () => {
      const c = this.webView;
      c.reload();
    });

    ipcRenderer.on('go-back', () => {
      const c = this.webView;
      c.goBack();
    });

    ipcRenderer.on('go-forward', () => {
      const c = this.webView;
      c.goForward();
    });

    ipcRenderer.on('go-home', () => {
      const c = this.webView;
      c.loadURL(this.props.customHome || window.shellInfo.url);
    });

    ipcRenderer.on('go-to-url', (e, url) => {
      const c = this.webView;
      c.loadURL(url);
    });

    ipcRenderer.on('copy-url', () => {
      const c = this.webView;
      const currentURL = c.getURL();
      clipboard.writeText(currentURL);
    });
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
    window.removeEventListener('resize', this.props.handleResize);
  }

  onDidFailLoad(e) {
    const { handleUpdateIsFailed } = this.props;

    // errorCode -3: cancelling
    // eslint-disable-next-line
    console.log('Error: ', e);
    if (e.isMainFrame && e.errorCode < 0 && e.errorCode !== -3) {
      handleUpdateIsFailed(true);
    }
  }

  onDidStopLoading() {
    const {
      handleUpdateIsLoading,
      handleUpdateCanGoBack,
      handleUpdateCanGoForward,
    } = this.props;

    const c = this.webView;

    handleUpdateIsLoading(false);
    handleUpdateCanGoBack(c.canGoBack());
    handleUpdateCanGoForward(c.canGoForward());
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

  render() {
    const {
      classes,
      findInPageIsOpen,
      handleUpdateFindInPageMatches,
      handleUpdateIsFailed,
      handleUpdateIsLoading,
      handleUpdateTargetUrl,
      isFailed,
    } = this.props;

    const {
      onDidStopLoading,
      onDidFailLoad,
      onNewWindow,
    } = this;


    return (
      <div className={classes.root}>
        <Navigation />
        {isFailed && (
          <div className={classes.errorFullScreenContainer}>
            Internet Connection
            Please check your Internet connection and try again
            <button
              onClick={() => {
                handleUpdateIsFailed(false);
                const c = this.webView;
                c.reload();
              }}
            >
              Try Again
            </button>
          </div>
        )}
        <div className={classes.rightContent}>
          {findInPageIsOpen && (
            <FindInPage
              onRequestFind={(text, forward) => {
                const c = this.webView;
                c.findInPage(text, { forward });
              }}
              onRequestStopFind={() => {
                const c = this.webView;
                c.stopFindInPage('clearSelection');
                handleUpdateFindInPageMatches(0, 0);
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
            webpreferences="nativeWindowOpen=yes"
            src={window.shellInfo.url}
            onDidFailLoad={onDidFailLoad}
            onDidStartLoading={() => handleUpdateIsLoading(true)}
            onDidStopLoading={onDidStopLoading}
            onFoundInPage={({ result }) =>
              handleUpdateFindInPageMatches(result.activeMatchOrdinal, result.matches)}
            onNewWindow={onNewWindow}
            onPageTitleUpdated={({ url, title }) => {
              document.title = title;
              handleUpdateTargetUrl(url);

              ipcRenderer.send('set-title', title);

              const itemCountRegex = /[([{](\d*?)[}\])]/;
              const match = itemCountRegex.exec(title);
              const newBadge = match ? match[1] : '';

              ipcRenderer.send('badge', newBadge);
            }}
          />
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  isFullScreen: false,
  isFailed: false,
  customHome: null,
};

App.propTypes = {
  findInPageIsOpen: PropTypes.bool.isRequired,
  findInPageText: PropTypes.string.isRequired,
  isFailed: PropTypes.bool,
  customHome: PropTypes.string,
  classes: PropTypes.object.isRequired,
  handleResize: PropTypes.func.isRequired,
  handleUpdateTargetUrl: PropTypes.func.isRequired,
  handleUpdateIsFailed: PropTypes.func.isRequired,
  handleUpdateIsLoading: PropTypes.func.isRequired,
  handleUpdateCanGoBack: PropTypes.func.isRequired,
  handleUpdateCanGoForward: PropTypes.func.isRequired,
  handleToggleFindInPageDialog: PropTypes.func.isRequired,
  handleUpdateFindInPageMatches: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  isFullScreen: state.screen.isFullScreen,
  isFailed: false && state.nav.isFailed,
  customHome: state.settings.customHome,
  rememberLastPage: state.settings.rememberLastPage,
});

const mapDispatchToProps = dispatch => ({
  handleResize: () => dispatch(screenResize(window.innerWidth)),
  handleUpdateTargetUrl: targetUrl => dispatch(updateTargetUrl(targetUrl)),
  handleUpdateIsFailed: isFailed => dispatch(updateIsFailed(isFailed)),
  handleUpdateIsLoading: isLoading => dispatch(updateIsLoading(isLoading)),
  handleUpdateCanGoBack: canGoBack => dispatch(updateCanGoBack(canGoBack)),
  handleUpdateCanGoForward: canGoForward => dispatch(updateCanGoForward(canGoForward)),
  handleToggleFindInPageDialog: () => dispatch(toggleFindInPageDialog()),
  handleUpdateFindInPageMatches: (activeMatch, matches) =>
    dispatch(updateFindInPageMatches(activeMatch, matches)),
});

export default connect(
  mapStateToProps, mapDispatchToProps,
)(withStyles(styleSheet)(App));
