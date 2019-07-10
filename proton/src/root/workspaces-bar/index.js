import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuItem } from 'material-ui/Menu';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import AddBoxIcon from 'material-ui-icons/AddBox';
import AddIcon from 'material-ui-icons/Add';
import Avatar from 'material-ui/Avatar';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import Paper from 'material-ui/Paper';
import PublicIcon from 'material-ui-icons/Public';
import Tooltip from 'material-ui/Tooltip';
import CancelIcon from 'material-ui-icons/Cancel';

import connectComponent from '../../helpers/connect-component';

import EnhancedMenu from '../../shared/enhanced-menu';

import { changeRoute } from '../../state/root/router/actions';
import { open as openDialogAbout } from '../../state/dialogs/about/actions';
import { open as openDialogSubmitApp } from '../../state/dialogs/submit-app/actions';
import { setAuthToken } from '../../state/root/auth/actions';

import {
  ROUTE_TOP_CHARTS,
} from '../../constants/routes';

import {
  STRING_ABOUT,
  STRING_ACCOUNT,
  STRING_ADD_WORKSPACE,
  STRING_HELP,
  STRING_LOG_IN,
  STRING_LOG_OUT,
  STRING_MORE,
  STRING_SUBMIT_APP,
  STRING_WEBSITE,
} from '../../constants/strings';

import { requestOpenInBrowser } from '../../senders/generic';

import WorkspacesItem from './workspace-item';

import noAvatarSvg from '../../assets/no-avatar.svg';

const styles = theme => ({
  container: {
    zIndex: 2,
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: 68,
    paddingTop: 18,
    boxSizing: 'border-box',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
  },
  containerWithoutTitlebar: {
    paddingTop: 28,
  },
  innerContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    width: '100%',
    margin: '12px 0px 2px 0px',
  },
  workspacesContainer: {
    flex: 1,
    overflow: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // padding: theme.spacing.unit,
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

const TabBar = (props) => {
  const {
    classes,
    displayName,
    isLoggedIn,
    onChangeRoute,
    onOpenDialogAbout,
    onOpenDialogSubmitApp,
    onSetAuthToken,
    profilePicture,
    workspaces,
  } = props;

  const showTitleBar = true;

  const workspacesItems = workspaces.map((workspace, index) =>
    <WorkspacesItem index={index} workspace={workspace} />);

  return (
    <Paper
      elevation={2}
      className={classnames(
        classes.container,
        window.platform === 'darwin' && !showTitleBar && classes.containerWithoutTitlebar,
      )}
    >
      <div className={classnames(classes.innerContainer)}>
        <div className={classes.workspacesContainer}>
          {workspacesItems}
        </div>
        <div className={classes.bottomContainer}>
          <Tooltip title={STRING_ADD_WORKSPACE} placement="right">
            <IconButton
              aria-label={STRING_ADD_WORKSPACE}
              onClick={() => onChangeRoute(ROUTE_TOP_CHARTS)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <EnhancedMenu
            id="moreButton"
            buttonElement={(
              <Tooltip title={STRING_MORE} placement="right">
                <IconButton
                  aria-label={STRING_MORE}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          >
            <MenuItem onClick={onOpenDialogSubmitApp}>
              <ListItemIcon><AddBoxIcon /></ListItemIcon>
              <ListItemText primary={STRING_SUBMIT_APP} />
            </MenuItem>
            <MenuItem
              button
              onClick={() => requestOpenInBrowser('https://webcatalog.io/help')}
            >
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary={STRING_HELP} />
            </MenuItem>
            <MenuItem
              button
              onClick={() => requestOpenInBrowser('https://webcatalog.io')}
            >
              <ListItemIcon><PublicIcon /></ListItemIcon>
              <ListItemText primary={STRING_WEBSITE} />
            </MenuItem>
            <MenuItem onClick={onOpenDialogAbout}>
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary={STRING_ABOUT} />
            </MenuItem>
          </EnhancedMenu>
          {isLoggedIn ? (
            <EnhancedMenu
              id="accountButton"
              buttonElement={(
                <Tooltip title={displayName} placement="right">
                  <Avatar className={classes.avatar} src={profilePicture || noAvatarSvg} />
                </Tooltip>
              )}
            >
              <MenuItem onClick={() => requestOpenInBrowser('https://dashboard.webcatalog.io')}>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary={STRING_ACCOUNT} />
              </MenuItem>
              <MenuItem onClick={() => onSetAuthToken(null)}>
                <ListItemIcon><CancelIcon /></ListItemIcon>
                <ListItemText primary={STRING_LOG_OUT} />
              </MenuItem>
            </EnhancedMenu>
          ) : (
            <Tooltip title={STRING_LOG_IN} placement="right" onClick={() => onSetAuthToken(null)}>
              <Avatar className={classes.avatar}>
                <AccountCircleIcon />
              </Avatar>
            </Tooltip>
          )}
        </div>
      </div>
    </Paper>
  );
};

TabBar.defaultProps = {
  profilePicture: null,
  displayName: null,
};

TabBar.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string,
  isLoggedIn: PropTypes.bool.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogSubmitApp: PropTypes.func.isRequired,
  onSetAuthToken: PropTypes.func.isRequired,
  profilePicture: PropTypes.string,
  workspaces: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  displayName: state.user.apiData.displayName,
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
  profilePicture: state.user.apiData.profilePicture,
  workspaces: state.workspacesBar.workspaces,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
  openDialogSubmitApp,
  setAuthToken,
};

export default connectComponent(
  TabBar,
  mapStateToProps,
  actionCreators,
  styles,
);
