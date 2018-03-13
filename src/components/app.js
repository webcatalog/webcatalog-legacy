import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import DialogAbout from './dialogs/about';
import DialogActivate from './dialogs/activate';
import DialogConfirmUninstallApp from './dialogs/confirm-uninstall-app';
import DialogCreateCustomApp from './dialogs/create-custom-app';

import BrowserPrompt from './root/browser-prompt';
import DownloadPrompt from './root/download-prompt';
import EnhancedAppBar from './root/enhanced-app-bar';
import EnhancedSnackBar from './root/enhanced-snackbar';
import FakeTitleBar from './shared/fake-title-bar';
import UpdaterMessage from './root/updater-message';

import InstalledApps from './pages/installed-apps';
import Directory from './pages/directory';

import { ROUTE_INSTALLED_APPS } from '../constants/routes';

import { updateBrowserInstalled } from '../state/root/general/actions';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
  },
};

class App extends React.Component {
  componentDidMount() {
    const { onUpdateBrowserInstalled } = this.props;

    onUpdateBrowserInstalled();
  }

  render() {
    const {
      classes,
      browserInstalled,
      browser,
      route,
    } = this.props;

    let pageContent;
    switch (route) {
      case ROUTE_INSTALLED_APPS:
        pageContent = <InstalledApps key="InstalledApps" />;
        break;
      default:
        pageContent = <Directory key="directory" />;
    }

    const renderContent = () => {
      if (browser === null) {
        return (
          <React.Fragment>
            <UpdaterMessage />
            <BrowserPrompt />
          </React.Fragment>
        );
      }

      if (browserInstalled) {
        return (
          <React.Fragment>
            <EnhancedAppBar />
            <UpdaterMessage />
            <DialogActivate />
            {pageContent}
          </React.Fragment>
        );
      }

      return (
        <React.Fragment>
          <UpdaterMessage />
          <DownloadPrompt />
        </React.Fragment>
      );
    };

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        {renderContent()}
        <EnhancedSnackBar />
        <DialogAbout />
        <DialogConfirmUninstallApp />
        <DialogCreateCustomApp />
      </div>
    );
  }
}

App.defaultProps = {
  browser: null,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  browserInstalled: PropTypes.bool.isRequired,
  browser: PropTypes.string,
  route: PropTypes.string.isRequired,
  onUpdateBrowserInstalled: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  browserInstalled: state.general.browserInstalled,
  browser: state.preferences.browser,
  route: state.router.route,
});

const actionCreators = {
  updateBrowserInstalled,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
