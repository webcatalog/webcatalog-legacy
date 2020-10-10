import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import StatedMenu from './stated-menu';

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
  requestShowAppTrialWindow,
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
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: theme.palette.text.secondary,
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

  const clickable = !inDetailsDialog && !id.startsWith('custom-');
  const buttonSize = inDetailsDialog ? 'large' : 'medium';
  const buttonVariant = inDetailsDialog ? 'contained' : 'text';

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
      return (<InstallationProgress defaultDesc={label} />);
    }

    return (
      <div>
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
        {url && (
          <Button
            className={classes.actionButton}
            color="default"
            size={buttonSize}
            variant={buttonVariant}
            disableElevation
            onClick={(e) => {
              e.stopPropagation();
              requestShowAppTrialWindow(id, url, name);
            }}
          >
            Try
          </Button>
        )}
      </div>
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
        <StatedMenu
          id={`more-menu-${id}`}
          buttonElement={(
            <Tooltip title="More" placement="right">
              <IconButton size="small" aria-label="More" classes={{ root: classes.topRight }}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        >
          {status === INSTALLING && cancelable && (
            <MenuItem
              dense
              onClick={() => {
                if (version) return requestCancelUpdateApp(id);
                return requestCancelInstallApp(id);
              }}
            >
              {version ? 'Cancel Update' : 'Cancel Installation'}
            </MenuItem>
          )}
          {status === INSTALLED && (
            <MenuItem
              dense
              onClick={() => onOpenDialogEditApp({
                engine,
                id,
                name,
                url,
                urlDisabled: Boolean(!url),
                icon,
              })}
            >
              Edit this App
            </MenuItem>
          )}
          {status === INSTALLED && isOutdated && (
            <MenuItem dense onClick={() => requestUninstallApp(id, name, engine)}>
              Uninstall
            </MenuItem>
          )}
          {!id.startsWith('custom-') && !inDetailsDialog && (
            [
              status === INSTALLED && <Divider key="menu-divider-app-info" />,
              <MenuItem
                key="app-info"
                dense
                onClick={() => onOpenDialogCatalogAppDetails(id)}
              >
                View Details
              </MenuItem>,
            ]
          )}
          <MenuItem
            dense
            onClick={() => onOpenDialogCreateCustomApp({
              name: `${name} 2`,
              url,
              urlDisabled: Boolean(!url),
              icon,
            })}
          >
            Create Custom App from&nbsp;
            {name}
          </MenuItem>
          {engine && (
            [
              <Divider key="menu-divider-engine" />,
              engine === 'electron' && (
                <MenuItem
                  key="release-notes"
                  dense
                  onClick={() => requestOpenInBrowser('https://webcatalog.app/release-notes')}
                >
                  {'What\'s New'}
                </MenuItem>
              ),
              engine === 'electron' && version ? (
                <MenuItem dense key="menu-version" onClick={null} disabled>
                  Powered by WebCatalog Engine&nbsp;
                  {version}
                  {isOutdated && (
                    <span>
                      &nbsp;(Latest:&nbsp;
                      {latestTemplateVersion}
                      )
                    </span>
                  )}
                </MenuItem>
              ) : (
                <MenuItem dense key="menu-version" onClick={null} disabled>
                  Powered by&nbsp;
                  {getEngineName(engine)}
                </MenuItem>
              ),
            ]
          )}
        </StatedMenu>
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
