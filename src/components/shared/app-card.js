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
import SvgIcon from '@material-ui/core/SvgIcon';

import MoreVertIcon from '@material-ui/icons/MoreVert';

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
import { updateApp } from '../../state/app-management/actions';
import { open as openDialogChooseEngine } from '../../state/dialog-choose-engine/actions';
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
    onOpenDialogChooseEngine,
    onOpenDialogCreateCustomApp,
    onOpenDialogEditApp,
    onUpdateApp,
    status,
    url,
    version,
  } = props;

  const clickable = !inDetailsDialog;
  const buttonSize = inDetailsDialog ? 'large' : 'medium';
  const buttonVariant = inDetailsDialog ? 'contained' : 'text';

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
        type: 'separator',
        visible: status === INSTALLED && !isOutdated,
      },
      {
        label: 'Reinstall (Repair)',
        visible: status === INSTALLED && !isOutdated,
        click: () => onUpdateApp(engine, id, name, url, icon),
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
        visible: Boolean(engine),
      },
      {
        label: 'What\'s New',
        visible: engine === 'electron',
        click: () => requestOpenInBrowser('https://webcatalog.app/release-notes'),
      },
      engine === 'electron' && version ? {
        label: `Powered by WebCatalog Engine ${version}${isOutdated ? ` (Latest: ${latestTemplateVersion})` : ''}`,
        enabled: false,
        visible: Boolean(engine),
      } : {
        label: `Powered by ${getEngineName(engine)}`,
        enabled: false,
        visible: Boolean(engine),
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
                onUpdateApp(engine, id, name, url, icon);
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
          onOpenDialogChooseEngine(id, name, url, icon);
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
          <HelpTooltip
            title={(
              <Typography variant="body2" color="textPrimary">
                {`${name} is a multisite app which lets you run and organize multiple web apps in a single place and switch between them easily.`}
              </Typography>
            )}
          >
            <IconButton
              size="small"
              aria-label="What is this?"
              classes={{ root: classes.topLeft }}
              onClick={() => requestOpenInBrowser('https://help.webcatalog.app/article/18-what-is-the-difference-between-standard-apps-and-multisite-apps')}
            >
              <SvgIcon fontSize="small">
                <path d="M10.25,2C10.44,2 10.61,2.11 10.69,2.26L12.91,6.22L13,6.5L12.91,6.78L10.69,10.74C10.61,10.89 10.44,11 10.25,11H5.75C5.56,11 5.39,10.89 5.31,10.74L3.09,6.78L3,6.5L3.09,6.22L5.31,2.26C5.39,2.11 5.56,2 5.75,2H10.25M10.25,13C10.44,13 10.61,13.11 10.69,13.26L12.91,17.22L13,17.5L12.91,17.78L10.69,21.74C10.61,21.89 10.44,22 10.25,22H5.75C5.56,22 5.39,21.89 5.31,21.74L3.09,17.78L3,17.5L3.09,17.22L5.31,13.26C5.39,13.11 5.56,13 5.75,13H10.25M19.5,7.5C19.69,7.5 19.86,7.61 19.94,7.76L22.16,11.72L22.25,12L22.16,12.28L19.94,16.24C19.86,16.39 19.69,16.5 19.5,16.5H15C14.81,16.5 14.64,16.39 14.56,16.24L12.34,12.28L12.25,12L12.34,11.72L14.56,7.76C14.64,7.61 14.81,7.5 15,7.5H19.5Z" />
              </SvgIcon>
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
  engine: null,
  iconThumbnail: null,
  inDetailsDialog: false,
  latestTemplateVersion: null,
  status: null,
  url: null,
  version: null,
};

AppCard.propTypes = {
  cancelable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string,
  iconThumbnail: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  inDetailsDialog: PropTypes.bool,
  isOutdated: PropTypes.bool.isRequired,
  latestTemplateVersion: PropTypes.string,
  name: PropTypes.string.isRequired,
  onOpenDialogCatalogAppDetails: PropTypes.func.isRequired,
  onOpenDialogChooseEngine: PropTypes.func.isRequired,
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onOpenDialogEditApp: PropTypes.func.isRequired,
  onUpdateApp: PropTypes.func.isRequired,
  status: PropTypes.string,
  url: PropTypes.string,
  version: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const app = state.appManagement.apps[ownProps.id];

  return {
    name: ownProps.name || app.name,
    url: ownProps.url || (app ? app.url : null),
    icon: ownProps.icon || app.icon,
    iconThumbnail: ownProps.iconThumbnail || (app ? app.icon128 : null),
    isOutdated: isOutdatedApp(ownProps.id, state),
    latestTemplateVersion: state.general.latestTemplateVersion,
    status: app ? app.status : null,
    engine: app ? app.engine : null,
    version: app ? app.version : null,
    cancelable: Boolean(app ? app.cancelable : false),
    progressPercent: state.general.installationProgress.percent,
    progressDesc: state.general.installationProgress.desc,
  };
};

const actionCreators = {
  openDialogCatalogAppDetails,
  openDialogChooseEngine,
  openDialogCreateCustomApp,
  openDialogEditApp,
  updateApp,
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
