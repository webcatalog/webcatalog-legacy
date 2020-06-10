import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import BuildIcon from '@material-ui/icons/Build';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SecurityIcon from '@material-ui/icons/Security';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import WidgetsIcon from '@material-ui/icons/Widgets';

import StatedMenu from '../../shared/stated-menu';

import connectComponent from '../../../helpers/connect-component';
import getEngineName from '../../../helpers/get-engine-name';

import { getInstallingAppsAsList } from '../../../state/app-management/utils';

import { open as openDialogAbout } from '../../../state/dialog-about/actions';
import { open as openDialogLicenseRegistration } from '../../../state/dialog-license-registration/actions';
import { open as openDialogProxy } from '../../../state/dialog-proxy/actions';
import { open as openDialogSetInstallationPath } from '../../../state/dialog-set-installation-path/actions';
import { open as openDialogSetPreferredEngine } from '../../../state/dialog-set-preferred-engine/actions';


import {
  requestCheckForUpdates,
  requestOpenInBrowser,
  requestOpenInstallLocation,
  requestQuit,
  requestResetPreferences,
  requestSetPreference,
  requestSetSystemPreference,
  requestShowMessageBox,
  requestShowRequireRestartDialog,
} from '../../../senders';

import webcatalogLogo from '../../../assets/webcatalog-logo.svg';
import translatiumLogo from '../../../assets/translatium-logo.svg';
import singleboxLogo from '../../../assets/singlebox-logo.svg';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  appBar: {
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  toolbar: {
    minHeight: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  scrollContainer: {
    flex: 1,
    padding: theme.spacing(2),
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  sectionTitle: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    width: '100%',
    WebkitAppRegion: 'none',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  inner: {
    width: '100%',
    maxWidth: 500,
    margin: '0 auto',
    [theme.breakpoints.between(800, 928)]: {
      margin: 0,
      float: 'right',
      maxWidth: 'calc(100% - 220px)',
    },
  },
  sidebar: {
    position: 'fixed',
    width: 200,
    color: theme.palette.text.primary,
    [theme.breakpoints.down(800)]: {
      display: 'none',
    },
  },
  logo: {
    height: 28,
  },
});

const getThemeString = (theme) => {
  if (theme === 'light') return 'Light';
  if (theme === 'dark') return 'Dark';
  return 'System default';
};

const getOpenAtLoginString = (openAtLogin) => {
  if (openAtLogin === 'yes-hidden') return 'Yes, but minimized';
  if (openAtLogin === 'yes') return 'Yes';
  return 'No';
};

const getFileManagerName = () => {
  if (window.process.platform === 'darwin') return 'Finder';
  if (window.process.platform === 'win32') return 'File Explorer';
  return 'file manager';
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

const getUpdaterDesc = (status, info) => {
  if (status === 'download-progress') {
    if (info != null) {
      const { transferred, total, bytesPerSecond } = info;
      return `Downloading updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    }
    return 'Downloading updates...';
  }
  if (status === 'checking-for-update') {
    return 'Checking for updates...';
  }
  if (status === 'update-available') {
    return 'Downloading updates...';
  }
  if (status === 'update-downloaded') {
    if (info && info.version) return `A new version (${info.version}) has been downloaded.`;
    return 'A new version has been downloaded.';
  }
  return null;
};

const Preferences = ({
  allowPrerelease,
  appCount,
  attachToMenubar,
  classes,
  createDesktopShortcut,
  createStartMenuShortcut,
  defaultHome,
  hideEnginePrompt,
  hideMenuBar,
  installationPath,
  installingAppCount,
  onOpenDialogAbout,
  onOpenDialogLicenseRegistration,
  onOpenDialogProxy,
  onOpenDialogSetInstallationPath,
  onOpenDialogSetPreferredEngine,
  openAtLogin,
  preferredEngine,
  registered,
  requireAdmin,
  themeSource,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
}) => {
  const handleUpdateInstallationPath = (newInstallationPath, newRequireAdmin) => {
    if (appCount > 0) {
      const { remote } = window.require('electron');
      remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        title: 'Uninstall all of WebCatalog apps first',
        message: 'You need to uninstall all of your WebCatalog apps before changing this preference.',
        buttons: ['OK'],
        cancelId: 0,
        defaultId: 0,
      }).catch(console.log); // eslint-disable-line
    } else {
      requestSetPreference('requireAdmin', newRequireAdmin);
      requestSetPreference('installationPath', newInstallationPath);
    }
  };

  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      ref: useRef(),
    },
    network: {
      text: 'Network',
      Icon: RouterIcon,
      ref: useRef(),
    },
    privacy: {
      text: 'Privacy & Security',
      Icon: SecurityIcon,
      ref: useRef(),
    },
    system: {
      text: 'System',
      Icon: BuildIcon,
      ref: useRef(),
      hidden: window.process.platform === 'linux',
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      ref: useRef(),
    },
    updates: {
      text: 'Updates',
      Icon: SystemUpdateAltIcon,
      ref: useRef(),
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      ref: useRef(),
    },
    atomeryApps: {
      text: 'Atomery Apps',
      Icon: StorefrontIcon,
      ref: useRef(),
    },
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      ref: useRef(),
    },
  };

  const { remote } = window.require('electron');

  return (
    <div className={classes.root}>
      {window.process.platform === 'darwin' && window.mode !== 'menubar' && (
      <AppBar position="static" className={classes.appBar} elevation={1} color="inherit">
        <Toolbar variant="dense" className={classes.toolbar}>
          <Typography variant="subtitle1" color="inherit" className={classes.title}>
            Preferences
          </Typography>
        </Toolbar>
      </AppBar>
      )}
      <div className={classes.scrollContainer}>
        <div className={classes.sidebar}>
          <List dense>
            {Object.keys(sections).map((sectionKey, i) => {
              const {
                Icon, text, ref, hidden,
              } = sections[sectionKey];
              if (hidden) return null;
              return (
                <React.Fragment key={sectionKey}>
                  {i > 0 && <Divider />}
                  <ListItem button onClick={() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </div>
        <div className={classes.inner}>
          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.general.ref}>
            General
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <StatedMenu
                id="themeSource"
                buttonElement={(
                  <ListItem button>
                    <ListItemText primary="Theme" secondary={getThemeString(themeSource)} />
                    <ChevronRightIcon color="action" />
                  </ListItem>
                )}
              >
                <MenuItem dense onClick={() => requestSetPreference('themeSource', 'system')}>System default</MenuItem>
                <MenuItem dense onClick={() => requestSetPreference('themeSource', 'light')}>Light</MenuItem>
                <MenuItem dense onClick={() => requestSetPreference('themeSource', 'dark')}>Dark</MenuItem>
              </StatedMenu>
              {window.process.platform !== 'darwin' && (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Hide menu bar"
                      secondary="Hide the menu bar unless the Alt key is pressed."
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        color="primary"
                        checked={hideMenuBar}
                        onChange={(e) => {
                          requestSetPreference('hideMenuBar', e.target.checked);
                          requestShowRequireRestartDialog();
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </>
              )}
              <Divider />
              <ListItem>
                <ListItemText
                  primary={window.process.platform === 'win32'
                    ? 'Attach to taskbar' : 'Attach to menu bar'}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={attachToMenubar}
                    onChange={(e) => {
                      requestSetPreference('attachToMenubar', e.target.checked);
                      requestShowRequireRestartDialog();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Show installed apps at launch"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={attachToMenubar || defaultHome === 'installed'}
                    disabled={attachToMenubar}
                    onChange={(e) => {
                      if (e.target.checked) {
                        requestSetPreference('defaultHome', 'installed');
                      } else {
                        requestSetPreference('defaultHome', 'home');
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.network.ref}>
            Network
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={onOpenDialogProxy}>
                <ListItemText primary="Configure proxy settings (BETA)" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.privacy.ref}>
            Privacy &amp; Security
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={() => requestOpenInBrowser('https://atomery.com/privacy?app=webcatalog&utm_source=webcatalog_app')}>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
            </List>
          </Paper>

          {window.process.platform !== 'linux' && (
            <>
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.sectionTitle}
                ref={sections.system.ref}
              >
                System
              </Typography>
              <Paper elevation={0} className={classes.paper}>
                <List disablePadding dense>
                  <StatedMenu
                    id="openAtLogin"
                    buttonElement={(
                      <ListItem button>
                        <ListItemText primary="Open at login" secondary={getOpenAtLoginString(openAtLogin)} />
                        <ChevronRightIcon color="action" />
                      </ListItem>
                    )}
                  >
                    <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'yes')}>Yes</MenuItem>
                    <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'yes-hidden')}>Yes, but minimized</MenuItem>
                    <MenuItem dense onClick={() => requestSetSystemPreference('openAtLogin', 'no')}>No</MenuItem>
                  </StatedMenu>
                </List>
              </Paper>
            </>
          )}

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.advanced.ref}>
            Advanced
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={onOpenDialogSetPreferredEngine}>
                <ListItemText primary="Preferred browser engine" secondary={getEngineName(preferredEngine)} />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Ask for browser engine selection before every installation"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={!hideEnginePrompt}
                    onChange={(e) => {
                      requestSetPreference('hideEnginePrompt', !e.target.checked);
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              {window.process.platform === 'win32' && (
                <>
                  <ListItem>
                    <ListItemText
                      primary="Automatically create desktop shortcuts for newly installed apps"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        color="primary"
                        checked={createDesktopShortcut}
                        onChange={(e) => {
                          requestSetPreference('createDesktopShortcut', e.target.checked);
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Automatically create Start Menu shortcuts for newly installed apps"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        color="primary"
                        checked={createStartMenuShortcut}
                        onChange={(e) => {
                          requestSetPreference('createStartMenuShortcut', e.target.checked);
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </>
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
                      <ListItemText
                        primary="Installation path"
                        secondary={`${installationPath} ${requireAdmin && installationPath !== '~/Applications/WebCatalog Apps' && installationPath !== '/Applications/WebCatalog Apps' ? '(require sudo)' : ''}`}
                      />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  )}
                >
                  {window.process.platform === 'win32' && (
                    [
                      (installationPath !== `${remote.app.getPath('home')}\\WebCatalog Apps`) && (
                        <MenuItem dense key="installation-path-menu-item">
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        onClick={() => {
                          handleUpdateInstallationPath(`${remote.app.getPath('home')}\\WebCatalog Apps`, false);
                        }}
                      >
                        {`${remote.app.getPath('home')}\\WebCatalog Apps`}
                      </MenuItem>,
                    ]
                  )}
                  {window.process.platform === 'darwin' && (
                    [
                      (installationPath !== '~/Applications/WebCatalog Apps' && installationPath !== '/Applications/WebCatalog Apps') && (
                        <MenuItem dense key="installation-path-menu-item">
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        onClick={() => {
                          handleUpdateInstallationPath('~/Applications/WebCatalog Apps', false);
                        }}
                      >
                        ~/Applications/WebCatalog Apps (default)
                      </MenuItem>,
                      <MenuItem
                        dense
                        key="default-sudo-installation-path-menu-item"
                        onClick={() => {
                          handleUpdateInstallationPath('/Applications/WebCatalog Apps', false);
                        }}
                      >
                        /Applications/WebCatalog Apps
                      </MenuItem>,
                    ]
                  )}
                  {window.process.platform === 'linux' && (
                    [
                      (installationPath !== '~/.webcatalog') && (
                        <MenuItem dense key="installation-path-menu-item">
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        onClick={() => {
                          handleUpdateInstallationPath('~/.webcatalog', false);
                        }}
                      >
                        ~/.webcatalog (default)
                      </MenuItem>,
                    ]
                  )}
                  <MenuItem dense onClick={onOpenDialogSetInstallationPath}>
                    Custom
                  </MenuItem>
                </StatedMenu>
              )}
              <Divider />
              <ListItem button onClick={requestOpenInstallLocation}>
                <ListItemText primary={`Open installation path in ${getFileManagerName()}`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Use hardware acceleration when available"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={useHardwareAcceleration}
                    onChange={(e) => {
                      requestSetPreference('useHardwareAcceleration', e.target.checked);
                      requestShowRequireRestartDialog();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.updates.ref}>
            Updates
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => requestCheckForUpdates(false)}
                disabled={updaterStatus === 'checking-for-update'
                  || updaterStatus === 'download-progress'
                  || updaterStatus === 'download-progress'
                  || updaterStatus === 'update-available'}
              >
                <ListItemText
                  primary={updaterStatus === 'update-downloaded' ? 'Restart to Apply Updates' : 'Check for Updates'}
                  secondary={getUpdaterDesc(updaterStatus, updaterInfo)}
                />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Receive pre-release updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={allowPrerelease}
                    onChange={(e) => {
                      requestSetPreference('allowPrerelease', e.target.checked);
                      requestShowRequireRestartDialog();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.reset.ref}>
            Reset
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={requestResetPreferences}>
                <ListItemText primary="Restore preferences to their original defaults" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.atomeryApps.ref}>
            Atomery Apps
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalogapp.com?utm_source=webcatalog_app')}>
                <ListItemText
                  primary={(<img src={webcatalogLogo} alt="WebCatalog" className={classes.logo} />)}
                  secondary="Run Web Apps like Real Apps"
                />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://singleboxapp.com?utm_source=webcatalog_app')}>
                <ListItemText
                  primary={(<img src={singleboxLogo} alt="Singlebox" className={classes.logo} />)}
                  secondary="All Your Apps in One Single Window"
                />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://translatiumapp.com?utm_source=webcatalog_app')}>
                <ListItemText
                  primary={(<img src={translatiumLogo} alt="Translatium" className={classes.logo} />)}
                  secondary="Translate Any Languages like a Pro"
                />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.miscs.ref}>
            Miscellaneous
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={onOpenDialogAbout}>
                <ListItemText primary="About" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalogapp.com?utm_source=webcatalog_app')}>
                <ListItemText primary="Website" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://atomery.com/support?app=webcatalog&utm_source=webcatalog_app')}>
                <ListItemText primary="Support" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={onOpenDialogLicenseRegistration} disabled={registered}>
                <ListItemText primary="License Registration" secondary={registered ? 'Registered. Thank you for supporting the development of WebCatalog.' : null} />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={requestQuit}>
                <ListItemText primary="Quit" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>
        </div>
      </div>
    </div>
  );
};

Preferences.defaultProps = {
  updaterInfo: null,
  updaterStatus: null,
};

Preferences.propTypes = {
  allowPrerelease: PropTypes.bool.isRequired,
  appCount: PropTypes.number.isRequired,
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  createDesktopShortcut: PropTypes.bool.isRequired,
  createStartMenuShortcut: PropTypes.bool.isRequired,
  defaultHome: PropTypes.string.isRequired,
  hideEnginePrompt: PropTypes.bool.isRequired,
  hideMenuBar: PropTypes.bool.isRequired,
  installationPath: PropTypes.string.isRequired,
  installingAppCount: PropTypes.number.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogLicenseRegistration: PropTypes.func.isRequired,
  onOpenDialogProxy: PropTypes.func.isRequired,
  onOpenDialogSetInstallationPath: PropTypes.func.isRequired,
  onOpenDialogSetPreferredEngine: PropTypes.func.isRequired,
  openAtLogin: PropTypes.oneOf(['yes', 'yes-hidden', 'no']).isRequired,
  preferredEngine: PropTypes.string.isRequired,
  registered: PropTypes.bool.isRequired,
  requireAdmin: PropTypes.bool.isRequired,
  themeSource: PropTypes.string.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
  useHardwareAcceleration: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  allowPrerelease: state.preferences.allowPrerelease,
  appCount: Object.keys(state.appManagement.apps).length,
  attachToMenubar: state.preferences.attachToMenubar,
  createDesktopShortcut: state.preferences.createDesktopShortcut,
  createStartMenuShortcut: state.preferences.createStartMenuShortcut,
  defaultHome: state.preferences.defaultHome,
  hideEnginePrompt: state.preferences.hideEnginePrompt,
  hideMenuBar: state.preferences.hideMenuBar,
  installationPath: state.preferences.installationPath,
  installingAppCount: getInstallingAppsAsList(state).length,
  openAtLogin: state.systemPreferences.openAtLogin,
  preferredEngine: state.preferences.preferredEngine,
  registered: state.preferences.registered,
  requireAdmin: state.preferences.requireAdmin,
  themeSource: state.preferences.themeSource,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
});

const actionCreators = {
  openDialogAbout,
  openDialogLicenseRegistration,
  openDialogSetInstallationPath,
  openDialogSetPreferredEngine,
  openDialogProxy,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
