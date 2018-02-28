import React from 'react';
import PropTypes from 'prop-types';

import AddIcon from 'material-ui-icons/Add';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import common from 'material-ui/colors/common';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';

import connectComponent from '../../helpers/connect-component';

import FakeTitleBar from '../shared/fake-title-bar';

import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialogs/create-custom-app/actions';
import {
  changeRoute,
} from '../../state/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_DIRECTORY,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_CREATE_CUSTOM_APP,
  STRING_DIRECTORY,
  STRING_INSTALLED_APPS,
} from '../../constants/strings';

import { requestCheckForUpdates } from '../../senders/updater';
import { requestScanInstalledApps } from '../../senders/local';

const styles = theme => ({
  root: {
    zIndex: 1,
  },
  toolbar: {
    padding: '0 12px',
  },
  title: {
    flex: 1,
  },
  appBar: {
    zIndex: 1,
  },
  tabRoot: {
    flexGrow: 1,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class EnhancedAppBar extends React.Component {
  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    requestScanInstalledApps();
    requestCheckForUpdates();
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onOpenDialogAbout,
      onOpenDialogCreateCustomApp,
      route,
    } = this.props;

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        <AppBar position="static" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <Tabs
              className={classes.title}
              value={route}
              onChange={(e, val) => onChangeRoute(val)}
              indicatorColor={common.fullWhite}
            >
              <Tab
                value={ROUTE_DIRECTORY}
                label={STRING_DIRECTORY}
              />
              <Tab
                value={ROUTE_INSTALLED_APPS}
                label={STRING_INSTALLED_APPS}
              />
            </Tabs>
            <Button color="contrast" onClick={onOpenDialogCreateCustomApp}>
              <AddIcon className={classes.leftIcon} />
              {STRING_CREATE_CUSTOM_APP}
            </Button>
            <Tooltip title={STRING_ABOUT} placement="bottom">
              <IconButton color="contrast" onClick={onOpenDialogAbout}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>

        </AppBar>
      </div>
    );
  }
}

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
  openDialogCreateCustomApp,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
