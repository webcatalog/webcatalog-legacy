import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../helpers/connect-component';

import FakeTitleBar from './root/fake-title-bar';
import EnhancedBottomNavigation from './root/enhanced-bottom-navigation';

import Installed from './pages/installed';
import Home from './pages/home';
import Preferences from './pages/preferences';

import DialogAbout from './dialogs/dialog-about';
import DialogChooseEngine from './dialogs/dialog-choose-engine';
import DialogCreateCustomApp from './dialogs/dialog-create-custom-app';
import DialogLicenseRegistration from './dialogs/dialog-license-registration';
import DialogProxy from './dialogs/dialog-proxy';
import DialogSetInstallationPath from './dialogs/dialog-set-installation-path';
import DialogSetPreferredEngine from './dialogs/dialog-set-preferred-engine';

import {
  ROUTE_HOME,
  ROUTE_PREFERENCES,
  ROUTE_INSTALLED,
} from '../constants/routes';
import {
  requestGetInstalledApps,
  requestCheckForUpdates,
} from '../senders';

import { fetchLatestTemplateVersionAsync } from '../state/general/actions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    background: theme.palette.background.default,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.updaterTimer = null;
  }

  componentDidMount() {
    requestCheckForUpdates(true); // isSilent = true
    requestGetInstalledApps();

    const { onFetchLatestTemplateVersionAsync } = this.props;
    onFetchLatestTemplateVersionAsync();
    this.updaterTimer = setTimeout(() => {
      onFetchLatestTemplateVersionAsync();
    }, 15 * 60 * 1000); // recheck every 15 minutes
  }

  componentWillUnmount() {
    clearTimeout(this.updaterTimer);
  }

  render() {
    const { classes, isFullScreen, route } = this.props;
    let pageContent;
    switch (route) {
      case ROUTE_PREFERENCES:
        pageContent = <Preferences key="preferences" />;
        break;
      case ROUTE_INSTALLED:
        pageContent = <Installed key="installed" />;
        break;
      default:
        pageContent = null;
    }

    return (
      <div className={classes.root}>
        {!isFullScreen && window.process.platform === 'darwin' && window.mode !== 'menubar' && <FakeTitleBar />}
        {pageContent}
        <Home hidden={route !== ROUTE_HOME} />
        <DialogAbout />
        <DialogChooseEngine />
        <DialogCreateCustomApp />
        <DialogLicenseRegistration />
        <DialogProxy />
        <DialogSetInstallationPath />
        <DialogSetPreferredEngine />
        <EnhancedBottomNavigation />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isFullScreen: state.general.isFullScreen,
  route: state.router.route,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
