/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import {
  requestShowAppMenu,
  requestOpenInBrowser,
} from '../../senders';

import connectComponent from '../../helpers/connect-component';
import getStaticGlobal from '../../helpers/get-static-global';

import billingPlans from '../../constants/billing-plans';

import firebase from '../../firebase';

const LEFT_RIGHT_WIDTH = window.process.platform !== 'darwin' ? 160 : 100;
const TOOLBAR_HEIGHT = 32;
const BUTTON_WIDTH = 46;

const styles = (theme) => ({
  appBar: {
    // leave space for resizing cursor
    // https://github.com/electron/electron/issues/3022
    padding: 4,
  },
  toolbar: {
    minHeight: 32,
    paddingLeft: theme.spacing(1) - 6,
    paddingRight: theme.spacing(1) - 6,
    display: 'flex',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  left: {
    width: LEFT_RIGHT_WIDTH,
    // leave space for traffic light buttons
    paddingLeft: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 0,
    boxSizing: 'border-box',
  },
  center: {
    flex: 1,
  },
  right: {
    width: LEFT_RIGHT_WIDTH,
    textAlign: 'right',
    boxSizing: 'border-box',
  },
  rightMac: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(0.5),
  },
  noDrag: {
    WebkitAppRegion: 'no-drag',
  },
  // https://github.com/AlexTorresSk/custom-electron-titlebar/blob/master/src/themebar.ts#L404
  windowsControl: {
    verticalAlign: 'middle',
    display: 'inline-block',
    height: TOOLBAR_HEIGHT,
    marginLeft: theme.spacing(2),
  },
  windowsIconBg: {
    display: 'inline-block',
    WebkitAppRegion: 'no-drag',
    height: '100%',
    width: BUTTON_WIDTH,
    background: 'none',
    border: 'none',
    outline: 'none',
    padding: 0,
    margin: 0,
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.primary.dark,
    },
  },
  windowsIcon: {
    height: '100%',
    width: '100%',
    maskSize: '23.1%',
    backgroundColor: theme.palette.common.white,
    cursor: 'pointer',
  },
  windowsIconClose: {
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  windowsIconUnmaximize: {
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  windowsIconMaximize: {
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  windowsIconMinimize: {
    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
  },
  iconButton: {
    width: BUTTON_WIDTH,
    borderRadius: 0,
    height: TOOLBAR_HEIGHT,
  },
  avatar: {
    height: 28,
    width: 28,
  },
});

const EnhancedAppBar = ({
  center,
  classes,
  currentPlan,
  displayName,
  isMaximized,
  photoURL,
  shouldUseDarkColors,
}) => {
  const useSystemTitleBar = getStaticGlobal('useSystemTitleBar');
  const onDoubleClick = (e) => {
    // feature: double click on title bar to expand #656
    // https://github.com/webcatalog/webcatalog-app/issues/656
    // https://stackoverflow.com/questions/10554446/no-onclick-when-child-is-clicked
    if (e.target === e.currentTarget) {
      const win = window.require('electron').remote.getCurrentWindow();
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  };

  const shouldShowMenuButton = window.process.platform === 'darwin'
    ? window.mode === 'menubar' // on Mac, only show the button in menu bar mode
    : (window.mode === 'menubar' || !useSystemTitleBar);

  return (
    <AppBar
      position="static"
      className={classes.appBar}
      color={shouldUseDarkColors ? 'default' : 'primary'}
    >
      <Toolbar
        variant="dense"
        className={classes.toolbar}
      >
        <div className={classes.left} onDoubleClick={onDoubleClick}>
          {shouldShowMenuButton && (
            <IconButton
              size="small"
              color="inherit"
              aria-label="Menu"
              className={classnames(classes.iconButton, classes.noDrag)}
              onClick={(e) => {
                e.stopPropagation();
                requestShowAppMenu(e.x, e.y);
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
        </div>
        <div className={classes.center} onDoubleClick={onDoubleClick}>
          {center}
        </div>
        <div
          className={classnames(classes.right, window.process.platform === 'darwin' && classes.rightMac)}
          onDoubleClick={onDoubleClick}
        >
          <Avatar
            alt={displayName}
            src={photoURL}
            className={classes.avatar}
            onClick={() => {
              const template = [
                {
                  label: displayName,
                  enabled: false,
                },
                {
                  label: billingPlans[currentPlan].name,
                  enabled: false,
                },
                {
                  type: 'separator',
                },
                {
                  label: 'Manage Your Account',
                  click: () => requestOpenInBrowser('https://accounts.webcatalog.app/settings/'),
                },
                {
                  type: 'separator',
                },
                {
                  label: 'Log Out',
                  click: () => firebase.auth().signOut(),
                },
              ];

              const menu = window.remote.Menu.buildFromTemplate(template);
              menu.popup(window.remote.getCurrentWindow());
            }}
          />
          {window.process.platform !== 'darwin' && !useSystemTitleBar && (
            <div className={classes.windowsControl}>
              <button
                className={classes.windowsIconBg}
                type="button"
                aria-label="Minimize"
                tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                onClick={(e) => {
                  e.stopPropagation();
                  const browserWindow = window.remote.getCurrentWindow();
                  browserWindow.minimize();
                }}
              >
                <div className={classnames(classes.windowsIcon, classes.windowsIconMinimize)} />
              </button>
              {window.mode !== 'menubar' && (
                <button
                  className={classes.windowsIconBg}
                  type="button"
                  aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                  tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                  onClick={(e) => {
                    e.stopPropagation();
                    const browserWindow = window.remote.getCurrentWindow();
                    if (browserWindow.isMaximized()) {
                      browserWindow.unmaximize();
                    } else {
                      browserWindow.maximize();
                    }
                  }}
                >
                  <div
                    className={classnames(
                      classes.windowsIcon,
                      isMaximized && classes.windowsIconUnmaximize,
                      !isMaximized && classes.windowsIconMaximize,
                    )}
                  />
                </button>
              )}
              {window.mode !== 'menubar' && (
                <button
                  className={classes.windowsIconBg}
                  type="button"
                  aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                  tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                  onClick={(e) => {
                    e.stopPropagation();
                    const browserWindow = window.remote.getCurrentWindow();
                    browserWindow.close();
                  }}
                >
                  <div
                    className={classnames(classes.windowsIcon, classes.windowsIconClose)}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

EnhancedAppBar.defaultProps = {
  center: null,
  currentPlan: 'basic',
  displayName: '',
  photoURL: null,
};

EnhancedAppBar.propTypes = {
  center: PropTypes.node,
  classes: PropTypes.object.isRequired,
  currentPlan: PropTypes.oneOf(['basic', 'lifetime', 'plus', 'pro']),
  displayName: PropTypes.string,
  isMaximized: PropTypes.bool.isRequired,
  photoURL: PropTypes.string,
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  currentPlan: state.user.publicProfile.billingPlan,
  displayName: state.user.displayName,
  isMaximized: state.general.isMaximized,
  photoURL: state.user.photoURL,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  null,
  styles,
);
