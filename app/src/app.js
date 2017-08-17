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

import WebView from './root/web-view';
import FindInPage from './root/find-in-page';
import NavigationBar from './root/navigation-bar';

import DialogPreferences from './dialogs/preferences';

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
    // height: '100vh',
    display: 'flex',
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
});

class App extends React.Component {
  constructor() {
    super();
    this.onDidFailLoad = this.onDidFailLoad.bind(this);
    this.onDidStopLoading = this.onDidStopLoading.bind(this);
    this.onNewWindow = this.onNewWindow.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.onScreenResize);

    ipcRenderer.on('toggle-dev-tools', () => {
      const c = this.webView;
      c.openDevTools();
    });

    ipcRenderer.on('toggle-find-in-page-dialog', () => {
      if (this.props.findInPageIsOpen) {
        const c = this.webView;
        c.stopFindInPage('clearSelection');
        this.props.onUpdateFindInPageMatches(0, 0);
      }
      this.props.onToggleFindInPageDialog();
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
    window.removeEventListener('resize', this.props.onScreenResize);
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
      onUpdateFindInPageMatches,
      onUpdateIsFailed,
      onUpdateIsLoading,
      onUpdateTargetUrl,
      isFailed,
    } = this.props;

    const {
      onDidStopLoading,
      onDidFailLoad,
      onNewWindow,
    } = this;

    const showVertNav = false;

    const horizNavElement = showVertNav
      ? null
      : <NavigationBar />;

    const vertNavElement = showVertNav
      ? <NavigationBar vert />
      : null;

    return (
      <div className={classes.root}>
        <DialogPreferences />
        {horizNavElement}
        {isFailed && (
          <div className={classes.errorFullScreenContainer}>
            Internet Connection
            Please check your Internet connection and try again
            <button
              onClick={() => {
                onUpdateIsFailed(false);
                const c = this.webView;
                c.reload();
              }}
            >
              Try Again
            </button>
          </div>
        )}
        <div className={classes.rightContent}>
          {vertNavElement}
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
            webpreferences="nativeWindowOpen=yes"
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
  onScreenResize: PropTypes.func.isRequired,
  onUpdateTargetUrl: PropTypes.func.isRequired,
  onUpdateIsFailed: PropTypes.func.isRequired,
  onUpdateIsLoading: PropTypes.func.isRequired,
  onUpdateCanGoBack: PropTypes.func.isRequired,
  onUpdateCanGoForward: PropTypes.func.isRequired,
  onToggleFindInPageDialog: PropTypes.func.isRequired,
  onUpdateFindInPageMatches: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  findInPageIsOpen: state.findInPage.isOpen,
  findInPageText: state.findInPage.text,
  isFullScreen: state.screen.isFullScreen,
  isFailed: false && state.nav.isFailed,
  customHome: null,
  rememberLastPage: false,
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
