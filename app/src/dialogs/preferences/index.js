import React from 'react';
import PropTypes from 'prop-types';

import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AppBar from 'material-ui/AppBar';
import blue from 'material-ui/colors/blue';
import BuildIcon from 'material-ui-icons/Build';
import Button from 'material-ui/Button';
import CodeIcon from 'material-ui-icons/Code';
import ColorLensIcon from 'material-ui-icons/ColorLens';
import common from 'material-ui/colors/common';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import grey from 'material-ui/colors/grey';
import HistoryIcon from 'material-ui-icons/History';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRightIcon from 'material-ui-icons/KeyboardArrowRight';
import MouseIcon from 'material-ui-icons/Mouse';
import Paper from 'material-ui/Paper';
import SecurityIcon from 'material-ui-icons/Security';
import Slide from 'material-ui/transitions/Slide';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
} from 'material-ui/List';

import connectComponent from '../../helpers/connect-component';

import {
  close,
} from '../../state/dialogs/preferences/actions';

import {
  requestLogOut,
} from '../../senders/auth';

import {
  requestOpenInBrowser,
} from '../../senders/generic';

const { lightBlack } = common;

const styles = {
  dialogContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  dialogContentRight: {
    flex: 1,
    padding: 24,
    background: grey[100],
    overflow: 'auto',
  },
  paperTitle: {
    width: '100%',
    maxWidth: 720,
    margin: '0 auto',
    fontWeight: 600,
    color: lightBlack,
    marginBottom: 4,
    paddingLeft: 16,
    fontSize: 13,
    '&:not(:first-child)': {
      marginTop: 36,
    },
  },
  paper: {
    maxWidth: 720,
    margin: '0 auto',
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  listContainer: {
    flex: '0 0 252px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  flex: {
    flex: 1,
  },
  accountSection: {
    padding: 16,
    textAlign: 'center',
  },
  accountSectionButton: {
    marginTop: 12,
  },
  link: {
    color: blue[500],
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

const PreferencesDialog = (props) => {
  const {
    classes,
    email,
    isLoggedIn,
    onClose,
    open,
  } = props;

  return (
    <Dialog
      fullScreen
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="up" />}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.flex}>
            Preferences
          </Typography>
          <Button color="contrast" onClick={onClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.dialogContent}>
        <div className={classes.listContainer}>
          <List subheader={<ListSubheader>General</ListSubheader>} dense>
            <ListItem
              button
            >
              <ListItemIcon>
                <ColorLensIcon />
              </ListItemIcon>
              <ListItemText primary="Apperance" />
            </ListItem>
            <ListItem
              button
            >
              <ListItemIcon>
                <MouseIcon />
              </ListItemIcon>
              <ListItemText primary="Trackpad" />
            </ListItem>
            <ListItem
              button
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItem>
          </List>
          <List subheader={<ListSubheader>Advanced</ListSubheader>} dense>
            <ListItem
              button
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Privacy & Security" />
            </ListItem>
            <ListItem
              button
            >
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary="System" />
            </ListItem>
            <ListItem
              button
            >
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText primary="Developers" />
            </ListItem>
            <ListItem
              button
            >
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Reset" />
            </ListItem>
          </List>
        </div>
        <div className={classes.dialogContentRight}>
          <Typography type="body2" className={classes.paperTitle}>
            Apperance
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary="Dark theme"
                  secondary={`"Maybe you have to know the darkness
                    before you can appreciate the light." - Madeleine L'Engle`}
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText
                  primary="Show navigator bar"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText
                  primary="Navigator bar position"
                  secondary="Top"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Change">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            Trackpad
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary="Swipe to navigate"
                  secondary={(
                    <span>
                      <span>Navigate between pages with 3-finger gesture. </span><br />
                      <span>To enable it, you also need to change </span>
                      <strong>
                        Preferences &gt; Trackpad &gt; More Gesture &gt; Swipe between page
                      </strong><br />
                      <span> to </span>
                      <strong>Swipe with three fingers</strong>
                      <span> or </span>
                      <strong>Swipe with two or three fingers</strong>.
                    </span>
                  )}
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            Account
          </Typography>
          <Paper className={classes.paper}>
            {isLoggedIn ? (
              <div className={classes.accountSection}>
                <Typography type="body1">
                  You are logged in as <strong>{email}</strong>.
                </Typography>
                <Button
                  raised
                  className={classes.accountSectionButton}
                  onClick={requestLogOut}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className={classes.accountSection}>
                <Typography type="body1">
                  To sign in to your account, open <strong>WebCatalog</strong> app.
                </Typography>
                <Button raised className={classes.accountSectionButton}>
                  Open WebCatalog
                </Button>
              </div>
            )}

          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            Privacy & Security
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary={(
                    <span>
                      <span>WebCatalog only enables </span>
                      <a
                        className={classes.link}
                        role="link"
                        tabIndex="0"
                        onClick={() => requestOpenInBrowser('https://www.intercom.com/in-app-messaging')}
                      >Intercom In-App Messaging</a>
                      <span> when you are opening Preferences dialog </span>
                      <span>and does not install any other tracking tools or services. </span>
                      <a
                        className={classes.link}
                        role="link"
                        tabIndex="0"
                        onClick={() => requestOpenInBrowser('https://www.intercom.com/in-app-messaging')}
                      >
                        Learn more
                      </a>
                    </span>
                  )}
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary="Clear browsing data"
                  secondary="Clear history, cookies, cache, and more"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Continue">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            System
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary="Use hardware acceleration when available"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            Developers
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary="User agent"
                  secondary="Default"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Change">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText
                  primary="Inject CSS"
                  secondary="Not enabled"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Change">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button>
                <ListItemText
                  primary="Inject JS"
                  secondary="Not enabled"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Change">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>

          <Typography type="body2" className={classes.paperTitle}>
            Reset
          </Typography>
          <Paper className={classes.paper}>
            <List dense>
              <ListItem button>
                <ListItemText
                  primary="Reset"
                  secondary="Restore settings to their original defaults"
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Continue">
                    <KeyboardArrowRightIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </div>
      </div>
    </Dialog>
  );
};

PreferencesDialog.defaultProps = {
  open: false,
  email: null,
};

PreferencesDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  open: state.dialogs.preferences.open,
  email: state.user.apiData.email,
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
});

const actionCreators = {
  close,
};

export default connectComponent(
  PreferencesDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
