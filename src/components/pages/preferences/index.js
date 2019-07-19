import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import StatedMenu from '../../shared/stated-menu';

import connectComponent from '../../../helpers/connect-component';

import { getInstallingAppsAsList } from '../../../state/app-management/utils';

import { open as openDialogSetInstallationPath } from '../../../state/dialog-set-installation-path/actions';

import {
  requestOpenInBrowser,
  requestResetPreferences,
  requestSetPreference,
  requestShowMessageBox,
  requestOpenInstallLocation,
} from '../../../senders';

const { remote } = window.require('electron');

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: theme.spacing.unit * 2,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  sectionTitle: {
    paddingLeft: theme.spacing.unit * 2,
  },
  paper: {
    marginTop: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 3,
    width: '100%',
  },
  inner: {
    width: '100%',
    maxWidth: 500,
    margin: '0 auto',
  },
  switchBase: {
    height: 'auto',
  },
});

const getThemeString = (theme) => {
  if (theme === 'light') return 'Light';
  if (theme === 'dark') return 'Dark';
  return 'Automatic';
};

const getFileManagerName = () => {
  if (window.process.platform === 'darwin') return 'Finder';
  if (window.process.platform === 'win32') return 'FIle Explorer';
  return 'file manager';
};

const Preferences = ({
  classes,
  createDesktopShortcut,
  createStartMenuShortcut,
  installationPath,
  installingAppCount,
  onOpenDialogSetInstallationPath,
  requireAdmin,
  theme,
}) => (
  <div className={classes.root}>
    <AppBar position="static" className={classes.appBar} elevation={2}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" className={classes.title}>
          Preferences
        </Typography>
      </Toolbar>
    </AppBar>
    <div className={classes.scrollContainer}>
      <div className={classes.inner}>
        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Appearance
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <StatedMenu
              id="theme"
              buttonElement={(
                <ListItem button>
                  <ListItemText primary="Theme" secondary={getThemeString(theme)} />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              {window.process.platform === 'darwin' && (
                <MenuItem onClick={() => requestSetPreference('theme', 'automatic')}>Automatic</MenuItem>
              )}
              <MenuItem onClick={() => requestSetPreference('theme', 'light')}>Light</MenuItem>
              <MenuItem onClick={() => requestSetPreference('theme', 'dark')}>Dark</MenuItem>
            </StatedMenu>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Privacy &amp; Security
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <ListItem button onClick={() => requestOpenInBrowser('https://getwebcatalog.com/privacy')}>
              <ListItemText primary="Privacy Policy" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Advanced
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            {window.process.platform === 'win32' && (
              <React.Fragment>
                <ListItem>
                  <ListItemText
                    primary="Automatically create desktop shortcuts for newly installed apps"
                  />
                  <Switch
                    checked={createDesktopShortcut}
                    onChange={(e) => {
                      requestSetPreference('createDesktopShortcut', e.target.checked);
                    }}
                    classes={{
                      switchBase: classes.switchBase,
                    }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Automatically create Start Menu shortcuts for newly installed apps"
                  />
                  <Switch
                    checked={createStartMenuShortcut}
                    onChange={(e) => {
                      requestSetPreference('createStartMenuShortcut', e.target.checked);
                    }}
                    classes={{
                      switchBase: classes.switchBase,
                    }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            )}
            {installingAppCount > 0 ? (
              <ListItem
                button
                onClick={() => {
                  requestShowMessageBox('This preference cannot be changed when installing or updating apps.');
                }}
              >
                <ListItemText primary="Installation path" secondary={`${installationPath} ${requireAdmin ? '(require sudo)' : ''}`} />
                <ChevronRightIcon color="action" />
              </ListItem>
            ) : (
              <StatedMenu
                id="installLocation"
                buttonElement={(
                  <ListItem button>
                    <ListItemText primary="Installation path" secondary={`${installationPath} ${requireAdmin ? '(require sudo)' : ''}`} />
                    <ChevronRightIcon color="action" />
                  </ListItem>
                )}
              >
                {window.process.platform === 'win32' && (
                  <React.Fragment>
                    {(installationPath !== `${remote.app.getPath('home')}\\WebCatalog Apps`) && (
                      <MenuItem>
                        {installationPath}
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        requestSetPreference('requireAdmin', false);
                        requestSetPreference('installationPath', `${remote.app.getPath('home')}\\WebCatalog Apps`);
                      }}
                    >
                      {`${remote.app.getPath('home')}\\WebCatalog Apps`}
                    </MenuItem>
                  </React.Fragment>
                )}
                {window.process.platform === 'darwin' && (
                  <React.Fragment>
                    {(installationPath !== '~/Applications/WebCatalog Apps' && installationPath !== '/Applications/WebCatalog Apps') && (
                      <MenuItem>
                        {installationPath}
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        requestSetPreference('requireAdmin', false);
                        requestSetPreference('installationPath', '~/Applications/WebCatalog Apps');
                      }}
                    >
                      ~/Applications/WebCatalog Apps (default)
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        requestSetPreference('requireAdmin', true);
                        requestSetPreference('installationPath', '/Applications/WebCatalog Apps');
                      }}
                    >
                      /Applications/WebCatalog Apps (requires sudo)
                    </MenuItem>
                  </React.Fragment>
                )}
                {window.process.platform === 'linux' && (
                  <React.Fragment>
                    {(installationPath !== '~/.webcatalog') && (
                      <MenuItem>
                        {installationPath}
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={() => {
                        requestSetPreference('requireAdmin', false);
                        requestSetPreference('installationPath', '~/.webcatalog');
                      }}
                    >
                      ~/.webcatalog (default)
                    </MenuItem>
                  </React.Fragment>
                )}
                <MenuItem onClick={onOpenDialogSetInstallationPath}>
                  Custom
                </MenuItem>
              </StatedMenu>
            )}
            <Divider />
            <ListItem button onClick={requestOpenInstallLocation}>
              <ListItemText primary={`Open installation path in ${getFileManagerName()}`} />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Reset
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            <ListItem button onClick={requestResetPreferences}>
              <ListItemText primary="Restore preferences to their original defaults" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  </div>
);

Preferences.propTypes = {
  classes: PropTypes.object.isRequired,
  createDesktopShortcut: PropTypes.bool.isRequired,
  createStartMenuShortcut: PropTypes.bool.isRequired,
  installationPath: PropTypes.string.isRequired,
  installingAppCount: PropTypes.number.isRequired,
  onOpenDialogSetInstallationPath: PropTypes.func.isRequired,
  requireAdmin: PropTypes.bool.isRequired,
  theme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  createDesktopShortcut: state.preferences.createDesktopShortcut,
  createStartMenuShortcut: state.preferences.createStartMenuShortcut,
  installationPath: state.preferences.installationPath,
  installingAppCount: getInstallingAppsAsList(state).length,
  requireAdmin: state.preferences.requireAdmin,
  theme: state.preferences.theme,
});

const actionCreators = {
  openDialogSetInstallationPath,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
