/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import MenuIcon from '@material-ui/icons/Menu';

import { requestShowAppMenu } from '../../senders';

import connectComponent from '../../helpers/connect-component';

const LEFT_RIGHT_WIDTH = window.process.platform === 'win32' ? 160 : 100;

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
    zIndex: 1000,
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  // https://github.com/electron/electron/issues/3022#issuecomment-543146976
  dragRegion: {
    top: 6,
    left: 6,
    display: 'block',
    position: 'absolute',
    width: 'calc(100% - 12px)',
    height: 'calc(100% - 6px)',
    zIndex: -1,
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
  noDrag: {
    WebkitAppRegion: 'no-drag',
  },
  // https://github.com/AlexTorresSk/custom-electron-titlebar/blob/master/src/themebar.ts#L404
  windowsControl: {
    verticalAlign: 'middle',
    display: 'inline-block',
    height: 32,
    marginLeft: theme.spacing(2),
  },
  windowsIconBg: {
    display: 'inline-block',
    WebkitAppRegion: 'no-drag',
    height: '100%',
    width: 46,
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
});

const EnhancedAppBar = ({
  center,
  classes,
  isMaximized,
  shouldUseDarkColors,
}) => {
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
          {(window.process.platform === 'darwin' && window.mode !== 'menubar') ? null : (
            <Tooltip title="Menu">
              <IconButton
                size="small"
                color="inherit"
                aria-label="More"
                className={classes.noDrag}
                onClick={(e) => {
                  e.stopPropagation();
                  requestShowAppMenu(e.x, e.y);
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <div className={classes.center} onDoubleClick={onDoubleClick}>
          {center}
        </div>
        <div className={classes.right} onDoubleClick={onDoubleClick}>
          {window.process.platform === 'win32' && (
            <div className={classes.windowsControl}>
              <button
                className={classes.windowsIconBg}
                type="button"
                aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                onClick={(e) => {
                  e.stopPropagation();
                  const browserWindow = window.remote.getCurrentWindow();
                  browserWindow.minimize();
                }}
              >
                <div className={classNames(classes.windowsIcon, classes.windowsIconMinimize)} />
              </button>
              <button
                className={classes.windowsIconBg}
                type="button"
                aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
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
                  className={classNames(
                    classes.windowsIcon,
                    isMaximized && classes.windowsIconUnmaximize,
                    !isMaximized && classes.windowsIconMaximize,
                  )}
                />
              </button>
              <button
                className={classes.windowsIconBg}
                type="button"
                aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                onClick={(e) => {
                  e.stopPropagation();
                  const browserWindow = window.remote.getCurrentWindow();
                  browserWindow.close();
                }}
              >
                <div
                  className={classNames(classes.windowsIcon, classes.windowsIconClose)}
                />
              </button>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

EnhancedAppBar.defaultProps = {
  center: null,
};

EnhancedAppBar.propTypes = {
  center: PropTypes.node,
  classes: PropTypes.object.isRequired,
  isMaximized: PropTypes.bool.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isMaximized: state.general.isMaximized,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  null,
  styles,
);
