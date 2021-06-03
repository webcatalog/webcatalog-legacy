/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import WarningIcon from '@material-ui/icons/Warning';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

import HelpTooltip from './help-tooltip';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';
import getEngineName from '../../helpers/get-engine-name';

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

const styles = (theme) => ({
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
});

const AppCard = (props) => {
  const {
    cancelable,
    category,
    classes,
    engine,
    icon,
    iconThumbnail,
    id,
    inDetailsDialog,
    isOutdated,
    latestTemplateVersion,
    name,
    onOpenDialogCatalogAppDetails,
    onInstallApp,
    onOpenDialogCreateCustomApp,
    onOpenDialogEditApp,
    onUpdateApp,
    opts,
    status,
    url,
    version,
    widevine,
  } = props;

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
        click: () => onOpenDialogEditApp({
          engine,
          id,
          name,
          url,
          urlDisabled: Boolean(!url),
          icon,
          opts: combinedOpts,
        }),
      },
      {
        label: 'Uninstall',
        visible: status === INSTALLED && isOutdated,
        click: () => requestUninstallApp(id, name, engine),
      },
      {
        label: 'Clone',
        click: () => onOpenDialogCreateCustomApp({
          name: `${name} 2`,
          url,
          urlDisabled: Boolean(!url),
          icon,
        }),
      },
      {
        label: 'Reinstall (Repair)',
        visible: status === INSTALLED && !isOutdated,
        click: () => onUpdateApp(id),
      },
      {
        type: 'separator',
        visible: !inDetailsDialog,
      },
      {
        label: 'Preferences...',
        visible: status === INSTALLED,
        click: () => requestOpenInBrowser('https://help.webcatalog.app/article/35-how-can-i-change-an-apps-preferences?utm_source=webcatalog_app'),
      },
      {
        type: 'separator',
        visible: !inDetailsDialog,
      },
      {
        label: 'View Details',
        visible: !inDetailsDialog,
        click: () => onOpenDialogCatalogAppDetails(id),
      },
      {
        type: 'separator',
      },
      {
        label: 'What\'s New',
        visible: engine === 'electron',
        click: () => requestOpenInBrowser('https://webcatalog.app/release-notes?utm_source=webcatalog_app'),
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
                onUpdateApp(id);
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
          onInstallApp(id, name, url, icon, combinedOpts);
        }}
      >
        {label}
      </Button>
    );
  };

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
          onOpenDialogCatalogAppDetails(id);
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
        <div className={classes.actionContainer}>
          {renderActionsElement()}
        </div>
        {!url && !inDetailsDialog && (
          <HelpTooltip title="Space">
            <IconButton
              size="small"
              aria-label="Space"
              classes={{ root: classes.topLeft }}
              onClick={(e) => {
                e.stopPropagation();
                requestOpenInBrowser('https://help.webcatalog.app/article/18-what-is-the-difference-between-standard-apps-and-multisite-apps')
              }}
            >
              <GroupWorkIcon fontSize="small" />
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
              onClick={() => requestOpenInBrowser('https://help.webcatalog.app/article/14-is-it-possible-to-create-apps-using-non-electron-browser-engines')}
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
  engine: null,
  iconThumbnail: null,
  inDetailsDialog: false,
  latestTemplateVersion: null,
  opts: {},
  status: null,
  url: null,
  version: null,
  widevine: false,
};

AppCard.propTypes = {
  cancelable: PropTypes.bool.isRequired,
  category: PropTypes.string,
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string,
  icon: PropTypes.string.isRequired,
  iconThumbnail: PropTypes.string,
  id: PropTypes.string.isRequired,
  inDetailsDialog: PropTypes.bool,
  isOutdated: PropTypes.bool.isRequired,
  latestTemplateVersion: PropTypes.string,
  name: PropTypes.string.isRequired,
  onInstallApp: PropTypes.func.isRequired,
  onOpenDialogCatalogAppDetails: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onOpenDialogEditApp: PropTypes.func.isRequired,
  onUpdateApp: PropTypes.func.isRequired,
  opts: PropTypes.object,
  status: PropTypes.string,
  url: PropTypes.string,
  version: PropTypes.string,
  widevine: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const app = state.appManagement.apps[ownProps.id];

  return {
    cancelable: Boolean(app ? app.cancelable : false),
    category: ownProps.category || (app && app.opts ? app.opts.category : undefined),
    engine: app ? app.engine : null,
    icon: ownProps.icon || app.icon,
    iconThumbnail: ownProps.iconThumbnail || (app ? app.icon128 : null),
    isOutdated: isOutdatedApp(ownProps.id, state),
    latestTemplateVersion: state.general.latestTemplateVersion,
    name: ownProps.name || app.name,
    opts: app && app.opts ? app.opts : undefined,
    progressDesc: state.general.installationProgress.desc,
    progressPercent: state.general.installationProgress.percent,
    status: app ? app.status : null,
    url: ownProps.url || (app ? app.url : null),
    version: app ? app.version : null,
  };
};

const actionCreators = {
  openDialogCatalogAppDetails,
  openDialogCreateCustomApp,
  openDialogEditApp,
  updateApp,
  installApp,
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
