import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import BuildIcon from '@material-ui/icons/Build';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SecurityIcon from '@material-ui/icons/Security';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import WidgetsIcon from '@material-ui/icons/Widgets';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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
  requestShowRequireRestartDialog,
} from '../../../senders';

import DefinedAppBar from './defined-app-bar';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
      maxWidth: 'calc(100% - 224px)',
    },
  },
  sidebar: {
    position: 'fixed',
    width: 204,
    color: theme.palette.text.primary,
    [theme.breakpoints.down(800)]: {
      display: 'none',
    },
  },
  listItemPromotion: {
    paddingLeft: theme.spacing(1),
  },
  promotionBlock: {
    display: 'flex',
    flex: 1,
  },
  promotionLeft: {
    height: 64,
    width: 64,
  },
  promotionRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5),
  },
  appTitle: {},
  appIcon: {
    height: 64,
  },
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

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
  sentry,
  telemetry,
  themeSource,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
}) => {
  const sections = {
    account: {
      text: 'Account',
      Icon: AccountCircleIcon,
      ref: useRef(),
    },
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
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      ref: useRef(),
    },
  };

  return (
    <div className={classes.root}>
      <DefinedAppBar />
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
          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.account.ref}>
            Account
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem button onClick={onOpenDialogLicenseRegistration} disabled>
                <ListItemText primary={registered ? 'WebCatalog Plus' : 'WebCatalog Basic'} />
              </ListItem>
              {!registered && (
                <>
                  <Divider />
                  <ListItem button onClick={onOpenDialogLicenseRegistration}>
                    <ListItemText primary="Upgrade to WebCatalog Plus" />
                    <ChevronRightIcon color="action" />
                  </ListItem>
                </>
              )}
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://forms.gle/RqwYdQo8PM67Mmvc9')}>
                <ListItemText primary="Join WebCatalog Pro Waitlist" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </List>
          </Paper>

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.general.ref}>
            General
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem>
                <ListItemText primary="Theme" />
                <Select
                  value={themeSource}
                  onChange={(e) => requestSetPreference('themeSource', e.target.value)}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                >
                  <MenuItem dense value="system">System default</MenuItem>
                  <MenuItem dense value="light">Light</MenuItem>
                  <MenuItem dense value="dark">Dark</MenuItem>
                </Select>
              </ListItem>
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
                      if (e.target.checked && !registered) {
                        onOpenDialogLicenseRegistration();
                        return;
                      }
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
              <ListItem>
                <ListItemText
                  primary="Allow the app to send anonymous crash reports"
                  secondary="Help us quickly diagnose and fix bugs in the app."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={telemetry}
                    onChange={(e) => {
                      requestSetPreference('telemetry', e.target.checked);
                      requestShowRequireRestartDialog();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Allow the app to send anonymous usage data"
                  secondary="Help us understand how to improve the product."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={sentry}
                    onChange={(e) => {
                      requestSetPreference('sentry', e.target.checked);
                      requestShowRequireRestartDialog();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.app/privacy?utm_source=webcatalog_app')}>
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
                  {window.process.platform !== 'linux' && (
                    <ListItem>
                      <ListItemText primary="Open at login" />
                      <Select
                        value={openAtLogin}
                        onChange={(e) => requestSetSystemPreference('openAtLogin', e.target.value)}
                        variant="filled"
                        disableUnderline
                        margin="dense"
                        classes={{
                          root: classes.select,
                        }}
                        className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                      >
                        <MenuItem dense value="yes">Yes</MenuItem>
                        <MenuItem dense value="yes-hidden">Yes, but minimized</MenuItem>
                        <MenuItem dense value="no">No</MenuItem>
                      </Select>
                    </ListItem>
                  )}
                </List>
              </Paper>
            </>
          )}

          <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.advanced.ref}>
            Advanced
          </Typography>
          <Paper elevation={0} className={classes.paper}>
            <List disablePadding dense>
              <ListItem
                button
                onClick={() => {
                  onOpenDialogSetPreferredEngine();
                }}
              >
                <ListItemText primary="Preferred browser engine" secondary={registered ? getEngineName(preferredEngine) : getEngineName('electron')} />
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
                      if (!registered && e.target.checked) {
                        onOpenDialogLicenseRegistration();
                        return;
                      }

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
              <ListItem>
                <ListItemText primary="Installation path" />
                <Select
                  value="-"
                  renderValue={() => `${installationPath} ${requireAdmin && installationPath !== '~/Applications/WebCatalog Apps' && installationPath !== '/Applications/WebCatalog Apps' ? '(require sudo)' : ''}`}
                  onChange={(e) => {
                    const val = e.target.value;

                    if (val == null) return;

                    if (appCount > 0) {
                      window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
                        title: 'Uninstall all of WebCatalog apps first',
                        message: 'You need to uninstall all of your WebCatalog apps before changing this preference.',
                        buttons: ['OK'],
                        cancelId: 0,
                        defaultId: 0,
                      }).catch(console.log); // eslint-disable-line
                    } else {
                      requestSetPreference('requireAdmin', val.requireAdmin);
                      requestSetPreference('installationPath', val.installationPath);
                    }
                  }}
                  variant="filled"
                  disableUnderline
                  margin="dense"
                  classes={{
                    root: classes.select,
                  }}
                  className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                  disabled={installingAppCount > 0}
                >
                  {window.process.platform === 'win32' && (
                    [
                      (installationPath !== `${window.remote.app.getPath('home')}\\WebCatalog Apps`) && (
                        <MenuItem dense key="installation-path-menu-item" value={null}>
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        value={{
                          installationPath: `${window.remote.app.getPath('home')}\\WebCatalog Apps`,
                          requireAdmin: false,
                        }}
                      >
                        {`${window.remote.app.getPath('home')}\\WebCatalog Apps`}
                      </MenuItem>,
                    ]
                  )}
                  {window.process.platform === 'darwin' && (
                    [
                      (installationPath !== '~/Applications/WebCatalog Apps' && installationPath !== '/Applications/WebCatalog Apps') && (
                        <MenuItem dense key="installation-path-menu-item" value={null}>
                          {installationPath}
                        </MenuItem>
                      ),
                      <MenuItem
                        dense
                        key="default-installation-path-menu-item"
                        value={{
                          installationPath: '~/Applications/WebCatalog Apps',
                          requireAdmin: false,
                        }}
                      >
                        ~/Applications/WebCatalog Apps (default)
                      </MenuItem>,
                      <MenuItem
                        dense
                        key="default-sudo-installation-path-menu-item"
                        value={{
                          installationPath: '/Applications/WebCatalog Apps',
                          requireAdmin: true,
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
                        value={{
                          installationPath: '~/.webcatalog',
                          requireAdmin: false,
                        }}
                      >
                        ~/.webcatalog (default)
                      </MenuItem>,
                    ]
                  )}
                  <MenuItem dense onClick={onOpenDialogSetInstallationPath}>
                    Custom
                  </MenuItem>
                </Select>
              </ListItem>
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
              <ListItem button onClick={() => requestOpenInBrowser('https://webcatalog.app?utm_source=webcatalog_app')}>
                <ListItemText primary="Website" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem button onClick={() => requestOpenInBrowser('https://help.webcatalog.app?utm_source=webcatalog_app')}>
                <ListItemText primary="Help" />
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
  sentry: PropTypes.bool.isRequired,
  telemetry: PropTypes.bool.isRequired,
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
  installationPath: state.preferences.installationPath,
  installingAppCount: getInstallingAppsAsList(state).length,
  openAtLogin: state.systemPreferences.openAtLogin,
  preferredEngine: state.preferences.preferredEngine,
  registered: state.preferences.registered,
  requireAdmin: state.preferences.requireAdmin,
  sentry: state.preferences.sentry,
  telemetry: state.preferences.telemetry,
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
