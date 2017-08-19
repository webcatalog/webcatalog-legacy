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

import { requestLogOut } from '../../senders/auth';
import { requestOpenInBrowser } from '../../senders/generic';
import { requestSetPreference } from '../../senders/preferences';

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
  paperTitleContainer: {
    border: 'none',
    outline: 'none',
    '&:not(:first-child)': {
      marginTop: 36,
    },
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

class PreferencesDialog extends React.Component {
  constructor(props) {
    super(props);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  scrollIntoView(refName) {
    // Explicitly scrollIntoView the text input using the raw DOM API
    const divFirst = this[refName];
    divFirst.scrollIntoView();
  }

  render() {
    const {
      classes,
      darkTheme,
      email,
      injectCSS,
      injectJS,
      isLoggedIn,
      navigationBarPosition,
      onClose,
      open,
      showNavigationBar,
      swipeToNavigate,
      useHardwareAcceleration,
      userAgent,
    } = this.props;

    const { scrollIntoView } = this;

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
                <ListItemText
                  primary="Apperance"
                  onClick={() => scrollIntoView('apperanceTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <MouseIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Trackpad"
                  onClick={() => scrollIntoView('trackpadTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Account"
                  onClick={() => scrollIntoView('accountTitle')}
                />
              </ListItem>
            </List>
            <List subheader={<ListSubheader>Advanced</ListSubheader>} dense>
              <ListItem
                button
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Privacy & Security"
                  onClick={() => scrollIntoView('privacyAndSecurityTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <BuildIcon />
                </ListItemIcon>
                <ListItemText
                  primary="System"
                  onClick={() => scrollIntoView('systemTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Developers"
                  onClick={() => scrollIntoView('developersTitle')}
                />
              </ListItem>
              <ListItem
                button
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Reset"
                  onClick={() => scrollIntoView('resetTitle')}
                />
              </ListItem>
            </List>
          </div>
          <div className={classes.dialogContentRight}>
            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.apperanceTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                Apperance
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => requestSetPreference('darkTheme', !darkTheme)}
                >
                  <ListItemText
                    primary="Dark theme"
                    secondary={`"Maybe you have to know the darkness
                      before you can appreciate the light." - Madeleine L'Engle`}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={darkTheme}
                      onChange={(e, checked) => requestSetPreference('darkTheme', checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => requestSetPreference('showNavigationBar', !showNavigationBar)}
                >
                  <ListItemText
                    primary="Show navigator bar"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={showNavigationBar}
                      onChange={(e, checked) => requestSetPreference('showNavigationBar', checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem button>
                  <ListItemText
                    primary="Navigator bar position"
                    secondary={navigationBarPosition}
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Change">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.trackpadTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                Trackpad
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => requestSetPreference('swipeToNavigate', !swipeToNavigate)}
                >
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
                    <Switch
                      checked={swipeToNavigate}
                      onChange={(e, checked) => requestSetPreference('swipeToNavigate', checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.accountTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                Account
              </Typography>
            </div>
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

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.privacyAndSecurityTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                Privacy & Security
              </Typography>
            </div>
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

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.systemTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                System
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem
                  button
                  onClick={() => requestSetPreference('useHardwareAcceleration', !useHardwareAcceleration)}
                >
                  <ListItemText
                    primary="Use hardware acceleration when available"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={useHardwareAcceleration}
                      onChange={(e, checked) => requestSetPreference('useHardwareAcceleration', checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.developersTitle = el; }}
            >
              <Typography
                type="body2"
                className={classes.paperTitle}
              >
                Developers
              </Typography>
            </div>
            <Paper className={classes.paper}>
              <List dense>
                <ListItem button>
                  <ListItemText
                    primary="User agent"
                    secondary={userAgent && userAgent.length > 0 ? userAgent : 'Default'}
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
                    secondary={injectCSS && injectCSS.length > 0 ? 'Enabled' : 'Not enabled'}
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
                    secondary={injectJS && injectJS.length > 0 ? 'Enabled' : 'Not enabled'}
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Change">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>

            <div
              className={classes.paperTitleContainer}
              ref={(el) => { this.resetTitle = el; }}
            >
              <Typography type="body2" className={classes.paperTitle}>
                Reset
              </Typography>
            </div>
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
  }
}

PreferencesDialog.defaultProps = {
  open: false,
  email: null,
  darkTheme: false,
  showNavigationBar: true,
  navigationBarPosition: 'left',
  swipeToNavigate: true,
  useHardwareAcceleration: true,
  userAgent: null,
  injectCSS: '',
  injectJS: '',
};

PreferencesDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  darkTheme: PropTypes.bool,
  email: PropTypes.string,
  injectCSS: PropTypes.string,
  injectJS: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  navigationBarPosition: PropTypes.oneOf(['top', 'left', 'right']),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  showNavigationBar: PropTypes.bool,
  swipeToNavigate: PropTypes.bool,
  useHardwareAcceleration: PropTypes.bool,
  userAgent: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    darkTheme,
    showNavigationBar,
    navigationBarPosition,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
    injectCSS,
    injectJS,
  } = state.preferences;

  return {
    darkTheme,
    email: state.user.apiData.email,
    injectCSS,
    injectJS,
    isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
    navigationBarPosition,
    open: state.dialogs.preferences.open,
    showNavigationBar,
    swipeToNavigate,
    useHardwareAcceleration,
    userAgent,
  };
};

const actionCreators = {
  close,
};

export default connectComponent(
  PreferencesDialog,
  mapStateToProps,
  actionCreators,
  styles,
);
