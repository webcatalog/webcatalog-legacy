import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import HelpIcon from 'material-ui-icons/Help';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import SettingsIcon from 'material-ui-icons/Settings';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders/generic';

import { changeRoute } from '../../state/root/router/actions';
import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogActivate } from '../../state/dialogs/activate/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialogs/create-custom-app/actions';
import { updatePreference } from '../../state/root/preferences/actions';

import EnhancedMenu from '../shared/enhanced-menu';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_DIRECTORY,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_ACTIVATE,
  STRING_CHANGE_BROWSER,
  STRING_CREATE_CUSTOM_APP,
  STRING_DIRECTORY,
  STRING_CONTACT,
  STRING_INSTALLED_APPS,
  STRING_MORE,
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
      activated,
      classes,
      onUpdatePreference,
      onChangeRoute,
      onOpenDialogAbout,
      onOpenDialogActivate,
      onOpenDialogCreateCustomApp,
      route,
    } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <Tabs
              className={classes.title}
              value={route}
              onChange={(e, val) => onChangeRoute(val)}
              indicatorColor="secondary"
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
              {!activated && (
                <ListItem button onClick={onOpenDialogActivate}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary={STRING_ACTIVATE} />
                </ListItem>
              )}
              {window.platform !== 'win32' && (
              <ListItem button onClick={() => onUpdatePreference('browser', null)}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_CHANGE_BROWSER} />
              </ListItem>
              )}
              <ListItem button onClick={() => requestOpenInBrowser('mailto:quang.lam2807@gmail.com?subject=[WebCatalog]')}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_CONTACT} />
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
  activated: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogActivate: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onUpdatePreference: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  activated: state.general.activated,
  route: state.router.route,
});

const actionCreators = {
  updatePreference,
  changeRoute,
  openDialogAbout,
  openDialogActivate,
  openDialogCreateCustomApp,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
