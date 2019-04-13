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

import {
  requestOpenInBrowser,
  requestResetPreferences,
  requestSetPreference,
  requestShowRequireRestartDialog,
  requestOpenInstallLocation,
} from '../../../senders';

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

const getInstallLocationString = (installLocation) => {
  if (installLocation === 'root') return '/Applications/WebCatalog Apps';
  return '~/Applications/WebCatalog Apps';
};

const Preferences = ({
  theme, classes, errorMonitoring, installLocation,
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
              <MenuItem onClick={() => requestSetPreference('theme', 'automatic')}>Automatic</MenuItem>
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
            <ListItem>
              <ListItemText primary="Send error monitoring data" />
              <Switch
                checked={errorMonitoring}
                onChange={(e) => {
                  requestSetPreference('errorMonitoring', e.target.checked);
                  requestShowRequireRestartDialog();
                }}
                classes={{
                  switchBase: classes.switchBase,
                }}
              />
            </ListItem>
            <Divider />
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
            <StatedMenu
              id="installLocation"
              buttonElement={(
                <ListItem button>
                  <ListItemText primary="Installation path" secondary={getInstallLocationString(installLocation)} />
                  <ChevronRightIcon color="action" />
                </ListItem>
              )}
            >
              <MenuItem onClick={() => requestSetPreference('installLocation', 'home')}>~/Applications/WebCatalog Apps (default)</MenuItem>
              <MenuItem onClick={() => requestSetPreference('installLocation', 'root')}>/Applications/WebCatalog Apps (requires sudo)</MenuItem>
            </StatedMenu>
            <Divider />
            <ListItem button onClick={requestOpenInstallLocation}>
              <ListItemText primary="Open installation path in Finder" />
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
  theme: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  errorMonitoring: PropTypes.bool.isRequired,
  installLocation: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  theme: state.preferences.theme,
  errorMonitoring: state.preferences.errorMonitoring,
  installLocation: state.preferences.installLocation,
});

export default connectComponent(
  Preferences,
  mapStateToProps,
  null,
  styles,
);
