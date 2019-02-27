import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';

import StatedMenu from '../shared/stated-menu';

import { updateIsDefaultMailClient } from '../../state/general/actions';

import {
  requestOpenInBrowser,
  requestSetPreference,
  requestResetPreferences,
  requestClearBrowsingData,
  requestShowRequireRestartDialog,
} from '../../senders';

const { remote } = window.require('electron');

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
    background: theme.palette.background.default,
  },
  sectionTitle: {
    paddingLeft: theme.spacing.unit * 2,
  },
  paper: {
    marginTop: theme.spacing.unit * 0.5,
    marginBottom: theme.spacing.unit * 3,
  },
  switchBase: {
    height: 'auto',
  },
});

const appJson = remote.getGlobal('appJson');

const getAppearanceString = (appearance) => {
  if (appearance === 'light') return 'Light';
  if (appearance === 'dark') return 'Dark';
  return 'Automatic';
};

const Preferences = ({
  appearance,
  classes,
  errorMonitoring,
  isDefaultMailClient,
  onUpdateIsDefaultMailClient,
  rememberLastPageVisited,
  sidebar,
  spellChecker,
  unreadCountBadge,
}) => (
  <div className={classes.root}>
    <Typography variant="subtitle2" className={classes.sectionTitle}>
      General
    </Typography>
    <Paper className={classes.paper}>
      <List dense>
        <StatedMenu
          id="appearance"
          buttonElement={(
            <ListItem button>
              <ListItemText primary="Appearance" secondary={getAppearanceString(appearance)} />
              <ChevronRightIcon color="action" />
            </ListItem>
          )}
        >
          <MenuItem onClick={() => requestSetPreference('appearance', 'automatic')}>Automatic</MenuItem>
          <MenuItem onClick={() => requestSetPreference('appearance', 'light')}>Light</MenuItem>
          <MenuItem onClick={() => requestSetPreference('appearance', 'dark')}>Dark</MenuItem>
        </StatedMenu>
        <Divider />
        <ListItem>
          <ListItemText primary="Show sidebar" />
          <Switch
            checked={sidebar}
            onChange={(e) => {
              requestSetPreference('sidebar', e.target.checked);
              requestShowRequireRestartDialog();
            }}
            classes={{
              switchBase: classes.switchBase,
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Show unread count badge" />
          <Switch
            checked={unreadCountBadge}
            onChange={(e) => {
              requestSetPreference('unreadCountBadge', e.target.checked);
              requestShowRequireRestartDialog();
            }}
            classes={{
              switchBase: classes.switchBase,
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Use spell checker" />
          <Switch
            checked={spellChecker}
            onChange={(e) => {
              requestSetPreference('spellChecker', e.target.checked);
              requestShowRequireRestartDialog();
            }}
            classes={{
              switchBase: classes.switchBase,
            }}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Remember last page visited" />
          <Switch
            checked={rememberLastPageVisited}
            onChange={(e) => {
              requestSetPreference('rememberLastPageVisited', e.target.checked);
              requestShowRequireRestartDialog();
            }}
            classes={{
              switchBase: classes.switchBase,
            }}
          />
        </ListItem>
      </List>
    </Paper>

    <Typography variant="subtitle2" className={classes.sectionTitle}>
      Privacy &amp; Security
    </Typography>
    <Paper className={classes.paper}>
      <List dense>
        <ListItem button onClick={requestClearBrowsingData}>
          <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more" />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
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

    {appJson.mailtoHandler && appJson.mailtoHandler.length > 0 && (
      <React.Fragment>
        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Default Mail Client
        </Typography>
        <Paper className={classes.paper}>
          <List dense>
            {isDefaultMailClient ? (
              <ListItem>
                <ListItemText secondary={`${appJson.name} is your default email client.`} />
              </ListItem>
            ) : (
              <ListItem>
                <ListItemText primary="Default mail client" secondary={`Make ${appJson.name} the default email client.`} />
                <Button
                  variant="outlined"
                  size="small"
                  color="default"
                  className={classes.button}
                  onClick={() => {
                    remote.app.setAsDefaultProtocolClient('mailto');
                    onUpdateIsDefaultMailClient(remote.app.isDefaultProtocolClient('mailto'));
                  }}
                >
                  Make default
                </Button>
              </ListItem>
            )}
          </List>
        </Paper>
      </React.Fragment>
    )}

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
);

Preferences.propTypes = {
  appearance: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  errorMonitoring: PropTypes.bool.isRequired,
  isDefaultMailClient: PropTypes.bool.isRequired,
  onUpdateIsDefaultMailClient: PropTypes.func.isRequired,
  rememberLastPageVisited: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  spellChecker: PropTypes.bool.isRequired,
  unreadCountBadge: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  appearance: state.preferences.appearance,
  errorMonitoring: state.preferences.errorMonitoring,
  isDefaultMailClient: state.general.isDefaultMailClient,
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  sidebar: state.preferences.sidebar,
  spellChecker: state.preferences.spellChecker,
  unreadCountBadge: state.preferences.unreadCountBadge,
});

const actionCreators = {
  updateIsDefaultMailClient,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
