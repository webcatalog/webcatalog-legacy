import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import LockIcon from 'material-ui-icons/Lock';
import { MenuItem } from 'material-ui/Menu';

import connectComponent from './helpers/connect-component';

import {
  getUser,
  removeUser,
} from './state/root/user/actions';
import { setAuthToken } from './state/root/auth/actions';
import { open as openPasswordDialog } from './state/dialogs/password/actions';
import { open as openProfileDialog } from './state/dialogs/profile/actions';

import logoWhitePng from './assets/logo-white.png';

import EnhancedSnackBar from './root/enhanced-snackbar';
import EnhancedMenu from './shared/enhanced-menu';

import Login from './pages/log-in';

import DialogProfile from './dialogs/profile';
import DialogPassword from './dialogs/password';

import {
  STRING_PROFILE,
  STRING_PASSWORD,
  STRING_LOG_OUT,
} from './constants/strings';

const styles = theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 1,
    height: 48,
  },
  logo: {
    height: 48,
  },
  cardContainer: {
    flex: 1,
  },
  avatar: {
    backgroundColor: theme.palette.common.fullWhite,
  },
  card: {
    padding: 12,
    boxSizing: 'border-box',
    textAlign: 'center',
    userSelect: 'none',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.primary[500],
      color: theme.palette.common.fullWhite,
    },
  },
  cardIcon: {
    height: 64,
    width: 64,
  },
});

class App extends React.Component {
  componentDidMount() {
    const {
      isLoggedIn,
      onGetUser,
    } = this.props;

    if (isLoggedIn) {
      onGetUser();
    }
  }

  render() {
    const {
      classes,
      displayName,
      isLoggedIn,
      onOpenPasswordDialog,
      onOpenProfileDialog,
      onRemoveUser,
      onSetAuthToken,
      profilePicture,
    } = this.props;

    if (!isLoggedIn) {
      return (
        <div className={classes.root}>
          <Login />
          <EnhancedSnackBar />
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.logoContainer}>
              <img src={logoWhitePng} alt="WebCatalog" className={classes.logo} />
            </div>
            <EnhancedMenu
              id="avatarButton"
              buttonElement={(
                <Avatar alt={displayName} src={profilePicture} className={classes.avatar} />
              )}
            >
              <MenuItem
                onClick={() => {
                  onSetAuthToken(null);
                  onRemoveUser();
                }}
              >
                {STRING_LOG_OUT}
              </MenuItem>
            </EnhancedMenu>
          </Toolbar>
        </AppBar>
        <Grid
          container
          className={classes.cardContainer}
          alignItems="center"
          direction="row"
          justify="center"
        >
          <Grid item xs={10} sm={4} lg={3}>
            <Paper
              className={classes.card}
              onClick={onOpenProfileDialog}
            >
              <AccountCircleIcon className={classes.cardIcon} />

              <Typography type="subtitle" color="inherit">
                {STRING_PROFILE}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={10} sm={4} lg={3}>
            <Paper
              className={classes.card}
              onClick={onOpenPasswordDialog}
            >
              <LockIcon className={classes.cardIcon} />

              <Typography type="subtitle" color="inherit">
                {STRING_PASSWORD}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <DialogProfile />
        <DialogPassword />
        <EnhancedSnackBar />
      </div>
    );
  }
}

App.defaultProps = {
  displayName: null,
  profilePicture: null,
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  onGetUser: PropTypes.func.isRequired,
  onOpenPasswordDialog: PropTypes.func.isRequired,
  onOpenProfileDialog: PropTypes.func.isRequired,
  onRemoveUser: PropTypes.func.isRequired,
  onSetAuthToken: PropTypes.func.isRequired,
  profilePicture: PropTypes.string,
};

const mapStateToProps = state => ({
  displayName: state.user.apiData.displayName,
  isLoggedIn: Boolean(state.auth.token),
  profilePicture: state.user.apiData.profilePicture,
});

const actionCreators = {
  getUser,
  openPasswordDialog,
  openProfileDialog,
  removeUser,
  setAuthToken,
};

export default connectComponent(
  App,
  mapStateToProps,
  actionCreators,
  styles,
);
