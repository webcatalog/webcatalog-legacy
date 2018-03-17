import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import common from 'material-ui/colors/common';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import SettingsIcon from 'material-ui-icons/Settings';

import connectComponent from '../../helpers/connect-component';

import FakeTitleBar from '../shared/fake-title-bar';
import EnhancedMenu from '../shared/enhanced-menu';

import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialogs/create-custom-app/actions';
import { open as openDialogPreferences } from '../../state/dialogs/preferences/actions';
import { changeRoute } from '../../state/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_DIRECTORY,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_CREATE_CUSTOM_APP,
  STRING_DIRECTORY,
  STRING_HELP,
  STRING_INSTALLED_APPS,
  STRING_MORE,
  STRING_PREFERENCES,
} from '../../constants/strings';

import { requestScanInstalledApps } from '../../senders/local';
import { requestOpenInBrowser } from '../../senders/generic';

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
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onOpenDialogAbout,
      onOpenDialogCreateCustomApp,
      onOpenDialogPreferences,
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
            <Button color="inherit" onClick={onOpenDialogCreateCustomApp}>
              <AddIcon className={classes.leftIcon} />
              {STRING_CREATE_CUSTOM_APP}
            </Button>
            <EnhancedMenu
              id="more"
              buttonElement={(
                <Tooltip title={STRING_MORE} placement="bottom">
                  <IconButton color="inherit">
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              )}
            >
              <ListItem button onClick={onOpenDialogPreferences}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_PREFERENCES} />
              </ListItem>
              <ListItem button onClick={() => requestOpenInBrowser('https://github.com/quanglam2807/juli/issues')}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_HELP} />
              </ListItem>
              <ListItem button onClick={onOpenDialogAbout}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_ABOUT} />
              </ListItem>
            </EnhancedMenu>
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
  onOpenDialogPreferences: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
  openDialogCreateCustomApp,
  openDialogPreferences,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
