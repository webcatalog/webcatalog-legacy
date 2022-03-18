/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import WarningIcon from '@material-ui/icons/Warning';

import HelpTooltip from './help-tooltip';

import isUrl from '../../helpers/is-url';
import getEngineName from '../../helpers/get-engine-name';
import isWidevineSupported from '../../helpers/is-widevine-supported';

import SpaceIcon from './space-icon';

import {
  INSTALLED,
  INSTALLING,
  UNINSTALLING,
} from '../../constants/app-statuses';

import {
  requestCancelInstallApp,
  requestCancelUpdateApp,
  requestOpenApp,
  requestOpenInBrowser,
  requestUninstallApp,
} from '../../senders';

import { isOutdatedApp } from '../../state/app-management/utils';
import { installApp, updateApp } from '../../state/app-management/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';
import { open as openDialogEditApp } from '../../state/dialog-edit-app/actions';
import { open as openDialogCatalogAppDetails } from '../../state/dialog-catalog-app-details/actions';

import InstallationProgress from './installation-progress';

const useStyles = makeStyles((theme) => ({
  card: {
    width: 168,
    height: 150,
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1),
    textAlign: 'center',
    position: 'relative',
    boxShadow: theme.palette.type === 'dark' ? 'none' : '0 0 0 1px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.2s ease-in-out',
  },
  cardClickable: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[3],
    },
  },
  cardFrameless: {
    boxShadow: 'none',
    width: '100%',
    height: '100%',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 'normal',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    fontWeight: 500,
    userSelect: 'none',
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    width: window.process.platform === 'win32' ? 48 : 56,
    height: window.process.platform === 'win32' ? 48 : 56,
    marginTop: window.process.platform === 'win32' ? 4 : 0,
    marginBottom: window.process.platform === 'win32' ? 4 : 0,
    userSelect: 'none',
  },
  paperIconMedium: {
    width: window.process.platform === 'win32' ? 72 : 96,
    height: window.process.platform === 'win32' ? 72 : 96,
    marginTop: window.process.platform === 'win32' ? 6 : 0,
    marginBottom: window.process.platform === 'win32' ? 6 : 0,
    userSelect: 'none',
  },
  paperIconLarge: {
    width: window.process.platform === 'win32' ? 96 : 128,
    height: window.process.platform === 'win32' ? 96 : 128,
    marginTop: window.process.platform === 'win32' ? 16 : 0,
    marginBottom: window.process.platform === 'win32' ? 16 : 0,
  },
  actionContainer: {
    marginTop: theme.spacing(1),
  },
  actionButton: {
    minWidth: 'auto',
    '&:not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
  topRight: {
    position: 'absolute',
    padding: 11, // 3 + theme.spacing(1),
    top: 0,
    right: 0,
    color: theme.palette.text.secondary,
    borderRadius: 0,
  },
  topLeft: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const getApp = (state, id) => state.appManagement.apps[id];

const AppCard = ({
  category: _category,
  icon: _icon,
  iconThumbnail: _iconThumbnail,
  id,
  inDetailsDialog,
  name: _name,
  requireInstanceUrl,
  simple,
  url: _url,
  widevine,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const latestTemplateVersion = useSelector((state) => state.general.latestTemplateVersion);
  const isOutdated = useSelector((state) => isOutdatedApp(id, state));

  const cancelable = useSelector((state) => {
    const app = getApp(state, id);
    return app ? Boolean(app.cancelable) : false;
  });
  const category = useSelector((state) => {
    if (_category) return _category;
    const app = getApp(state, id);
    return app && app.opts ? app.category : undefined;
  });
  const engine = useSelector((state) => {
    const app = getApp(state, id);
    return app ? app.engine : null;
  });
  const icon = useSelector((state) => {
    if (_icon) return _icon;
    const app = getApp(state, id);
    return app ? app.icon : null;
  });
  const iconThumbnail = useSelector((state) => {
    if (_iconThumbnail) return _iconThumbnail;
    const app = getApp(state, id);
    return app ? app.icon128 : null;
  });
  const name = useSelector((state) => {
    if (_name) return _name;
    const app = getApp(state, id);
    return app ? app.name : null;
  });
  const opts = useSelector((state) => {
    const app = getApp(state, id);
    return app && app.opts ? app.opts : undefined;
  });
  const status = useSelector((state) => {
    const app = getApp(state, id);
    return app ? app.status : null;
  });
  const url = useSelector((state) => {
    if (_url) return _url;
    const app = getApp(state, id);
    return app ? app.url : null;
  });
  const version = useSelector((state) => {
    const app = getApp(state, id);
    return app ? app.version : null;
  });

  const clickable = !inDetailsDialog;
  const buttonSize = inDetailsDialog ? 'large' : 'medium';
  const buttonVariant = inDetailsDialog ? 'contained' : 'text';

  const combinedOpts = { ...opts };
  if (category) {
    combinedOpts.category = category;
  }
  if (widevine) {
    combinedOpts.widevine = widevine;
  }

  const showMenu = () => {
    const template = [
      {
        label: version ? 'Cancel Update' : 'Cancel Installation',
        visible: status === INSTALLING && cancelable,
        click: () => {
          if (version) return requestCancelUpdateApp(id);
          return requestCancelInstallApp(id);
        },
      },
      {
        label: 'Edit',
        visible: status === INSTALLED,
        click: () => dispatch(openDialogEditApp({
          engine,
          id,
          name,
          url,
          urlDisabled: Boolean(!url),
          icon,
          opts: combinedOpts,
        })),
      },
      {
        label: 'Clone',
        click: () => dispatch(openDialogCreateCustomApp({
          name: `${name} 2`,
          url,
          urlDisabled: Boolean(!url),
          icon,
        })),
      },
      {
        type: 'separator',
        visible: !inDetailsDialog,
      },
      {
        label: 'Preferences...',
        visible: status === INSTALLED,
        click: () => requestOpenInBrowser('https://docs.webcatalog.io/article/35-how-can-i-change-an-apps-preferences?utm_source=webcatalog_app'),
      },
      {
        type: 'separator',
        visible: status === INSTALLED,
      },
      {
        label: 'Reinstall (Repair)',
        visible: status === INSTALLED && !isOutdated,
        click: () => dispatch(updateApp(id)),
      },
      {
        label: 'Uninstall',
        visible: status === INSTALLED,
        click: () => requestUninstallApp(id, name, engine),
      },
      {
        type: 'separator',
        visible: !inDetailsDialog,
      },
      {
        label: 'View Details',
        visible: !inDetailsDialog,
        click: () => dispatch(openDialogCatalogAppDetails(id)),
      },
      {
        type: 'separator',
      },
      {
        label: 'What\'s New',
        visible: engine === 'electron',
        click: () => requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/changelog/neutron/?utm_source=webcatalog_app'),
      },
      !engine || engine === 'electron' ? {
        label: `Version ${version}${isOutdated ? ` (Latest: ${latestTemplateVersion})` : ''}`,
        enabled: false,
        visible: Boolean(version),
      } : {
        label: `Powered by ${getEngineName(engine)} (implementation ${version})`,
        enabled: false,
        visible: Boolean(engine && version),
      },
    // visible doesn't work with type='separator'
    // https://github.com/electron/electron/issues/3494#issuecomment-455822039
    ].filter((item) => item.visible !== false);

    const menu = window.remote.Menu.buildFromTemplate(template);
    menu.popup(window.remote.getCurrentWindow());
  };

  const renderActionsElement = () => {
    if (status === INSTALLED) {
      return (
        <div>
          <Button
            className={classes.actionButton}
            size={buttonSize}
            variant={buttonVariant}
            disableElevation
            onClick={(e) => {
              e.stopPropagation();
              requestOpenApp(id, name);
            }}
          >
            Open
          </Button>
          {isOutdated && (
            <Button
              className={classes.actionButton}
              color="primary"
              size={buttonSize}
              variant={buttonVariant}
              disableElevation
              onClick={(e) => {
                e.stopPropagation();
                dispatch(updateApp(id));
              }}
            >
              Update
            </Button>
          )}
          {!isOutdated && (
            <Button
              className={classes.actionButton}
              color="secondary"
              variant={buttonVariant}
              size={buttonSize}
              disableElevation
              onClick={(e) => {
                e.stopPropagation();
                requestUninstallApp(id, name, engine);
              }}
            >
              Uninstall
            </Button>
          )}
        </div>
      );
    }

    let showProgress = false;
    let label = 'Install';
    if (status === INSTALLING && version) {
      if (cancelable) label = 'Queueing...';
      else {
        label = 'Updating...';
        showProgress = true;
      }
    } else if (status === INSTALLING) {
      if (cancelable) label = 'Queueing...';
      else {
        label = 'Installing...';
        showProgress = true;
      }
    } else if (status === UNINSTALLING) label = 'Uninstalling...';

    if (showProgress) {
      return (<InstallationProgress defaultDesc="Checking requirements..." />);
    }

    return (
      <Button
        className={classes.actionButton}
        color="primary"
        size={buttonSize}
        variant={buttonVariant}
        disableElevation
        disabled={status !== null}
        onClick={(e) => {
          e.stopPropagation();

          // if the app requires instance URL
          // user has to configure the app URL before adding workspace
          if (requireInstanceUrl) {
            dispatch(openDialogCreateCustomApp({
              name,
              url,
              urlDisabled: Boolean(!url),
              icon,
            }));
            return;
          }

          // inform users that
          // widevine is not supported on Linux (ARM64) & Windows (x64 + arm64)
          if (!widevine || isWidevineSupported()) {
            dispatch(installApp(id, name, url, icon, combinedOpts));
          } else {
            window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
              message: `Due to technical limitations, ${name} app is not supported on this device.`,
              buttons: ['I Understand', 'Install Anyway'],
              cancelId: 0,
              defaultId: 0,
            })
              .then(({ response }) => {
                if (response === 1) {
                  dispatch(installApp(id, name, url, icon, combinedOpts));
                }
              })
              .catch(console.log); // eslint-disable-line
          }
        }}
      >
        {label}
      </Button>
    );
  };

  // in simple mode, we only show the actions
  // if the app/space needs to be updated or it is being updated
  const shouldShowActions = !simple || status !== INSTALLED || isOutdated;

  return (
    <Grid item>
      <Paper
        elevation={0}
        className={classnames(
          classes.card,
          clickable && classes.cardClickable,
          inDetailsDialog && classes.cardFrameless,
        )}
        onClick={clickable ? () => {
          if (simple) {
            requestOpenApp(id, name);
            return;
          }
          dispatch(openDialogCatalogAppDetails(id));
        } : null}
        onContextMenu={() => {
          showMenu();
        }}
      >
        <img
          alt={name}
          className={classnames(
            classes.paperIcon,
            inDetailsDialog && classes.paperIconLarge,
            !shouldShowActions && classes.paperIconMedium,
          )}
          src={iconThumbnail || (isUrl(icon) ? icon : `file://${icon}`)}
        />
        <Typography
          className={classes.appName}
          title={name}
          variant={inDetailsDialog ? 'h5' : 'subtitle2'}
        >
          {name}
        </Typography>
        {shouldShowActions && (
          <div className={classes.actionContainer}>
            {renderActionsElement()}
          </div>
        )}
        {!url && !inDetailsDialog && !simple && (
          <HelpTooltip title="Space">
            <IconButton
              size="small"
              aria-label="Space"
              classes={{ root: classes.topLeft }}
              onClick={(e) => {
                e.stopPropagation();
                requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/spaces/');
              }}
            >
              <SpaceIcon fontSize="small" />
            </IconButton>
          </HelpTooltip>
        )}
        {engine && engine !== 'electron' && (
          <HelpTooltip
            title={(
              <Typography variant="body2" color="textPrimary">
                {`Apps powered by ${getEngineName(engine)} are no longer supported by WebCatalog. Click to learn more.`}
              </Typography>
            )}
          >
            <IconButton
              size="small"
              aria-label="Warning"
              classes={{ root: classes.topLeft }}
              onClick={() => requestOpenInBrowser('https://docs.webcatalog.io/article/14-is-it-possible-to-create-apps-using-non-electron-browser-engines')}
            >
              <WarningIcon fontSize="small" />
            </IconButton>
          </HelpTooltip>
        )}
        <IconButton
          size="small"
          aria-label={`More Options for ${name}`}
          classes={{ root: classes.topRight }}
          onClick={(e) => {
            e.stopPropagation();
            showMenu();
          }}
        >
          <MoreVertIcon fontSize={inDetailsDialog ? 'default' : 'small'} />
        </IconButton>
      </Paper>
    </Grid>
  );
};

AppCard.defaultProps = {
  category: undefined,
  icon: undefined,
  iconThumbnail: undefined,
  inDetailsDialog: false,
  name: undefined,
  requireInstanceUrl: false,
  simple: false,
  url: undefined,
  widevine: false,
};

AppCard.propTypes = {
  category: PropTypes.string,
  icon: PropTypes.string,
  iconThumbnail: PropTypes.string,
  id: PropTypes.string.isRequired,
  inDetailsDialog: PropTypes.bool,
  requireInstanceUrl: PropTypes.bool,
  simple: PropTypes.bool,
  name: PropTypes.string,
  url: PropTypes.string,
  widevine: PropTypes.bool,
};

export default AppCard;
