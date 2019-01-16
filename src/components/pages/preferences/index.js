import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import StatedMenu from '../../shared/stated-menu';

import connectComponent from '../../../helpers/connect-component';

import {
  requestResetPreferences,
  requestSetPreference,
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
});

const getAppearanceString = (appearance) => {
  if (appearance === 'light') return 'Light';
  if (appearance === 'dark') return 'Dark';
  return 'Automatic';
};

const Preferences = ({ appearance, classes }) => (
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
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle}>
          Reset Settings
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
  appearance: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appearance: state.preferences.appearance,
});

export default connectComponent(
  Preferences,
  mapStateToProps,
  null,
  styles,
);
