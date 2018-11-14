import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import HelpIcon from '@material-ui/icons/Help';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PublicIcon from '@material-ui/icons/Public';

import connectComponent from '../../helpers/connect-component';

import { requestOpenInBrowser } from '../../senders/generic';

import { changeRoute } from '../../state/root/router/actions';
import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialogs/create-custom-app/actions';
import { updatePreference } from '../../state/root/preferences/actions';

import EnhancedMenu from '../shared/enhanced-menu';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_DIRECTORY,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_CHANGE_BROWSER,
  STRING_CREATE_CUSTOM_APP,
  STRING_DIRECTORY,
  STRING_CONTACT,
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
  tab: {
    minHeight: '64px',
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
      onUpdatePreference,
      onChangeRoute,
      onOpenDialogAbout,
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
                className={classes.tab}
              />
              <Tab
                value={ROUTE_INSTALLED_APPS}
                label={STRING_INSTALLED_APPS}
                className={classes.tab}
              />
            </Tabs>
            <Button color="inherit" onClick={onOpenDialogCreateCustomApp}>
              <AddIcon className={classes.leftIcon} />
              {STRING_CREATE_CUSTOM_APP}
            </Button>
            <EnhancedMenu
              id="more"
              buttonElement={(
                <IconButton color="inherit">
                  <MoreVertIcon />
                </IconButton>
              )}
            >
              <ListItem button onClick={() => onUpdatePreference('browser', null)}>
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_CHANGE_BROWSER} />
              </ListItem>
              <ListItem button onClick={() => requestOpenInBrowser('https://getwebcatalog.com/support')}>
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
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onUpdatePreference: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  updatePreference,
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
