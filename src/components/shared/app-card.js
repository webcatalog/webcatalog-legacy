import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';

import StatedMenu from './stated-menu';

import connectComponent from '../../helpers/connect-component';
import isUrl from '../../helpers/is-url';
import getEngineName from '../../helpers/get-engine-name';

import extractHostname from '../../helpers/extract-hostname';

import {
  INSTALLED,
  INSTALLING,
  UNINSTALLING,
} from '../../constants/app-statuses';

import {
  requestOpenApp,
  requestUninstallApp,
  requestCancelInstallApp,
  requestCancelUpdateApp,
} from '../../senders';

import { isOutdatedApp } from '../../state/app-management/utils';
import { updateApp } from '../../state/app-management/actions';
import { open as openDialogChooseEngine } from '../../state/dialog-choose-engine/actions';
import { open as openDialogCreateCustomApp } from '../../state/dialog-create-custom-app/actions';
import { open as openDialogEditApp } from '../../state/dialog-edit-app/actions';
import { open as openDialogContextAppHelp } from '../../state/dialog-context-app-help/actions';

import InstallationProgress from './installation-progress';

const styles = (theme) => ({
  card: {
    width: 160,
    height: 150,
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1),
    textAlign: 'center',
    position: 'relative',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    marginTop: theme.spacing(1),
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    width: 48,
    height: 48,
  },
  actionContainer: {
    marginTop: theme.spacing(1),
  },
  actionButton: {
    minWidth: 'auto',
    fontSize: '0.8em',
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
    icon128,
    id,
    isOutdated,
    latestTemplateVersion,
    name,
    onOpenDialogChooseEngine,
    onOpenDialogContextAppHelp,
    onOpenDialogCreateCustomApp,
    onOpenDialogEditApp,
    onUpdateApp,
    status,
    url,
    version,
  } = props;

  const renderActionsElement = () => {
    if (status === INSTALLED) {
      return (
        <div>
          <Button
            className={classes.actionButton}
            size="medium"
            onClick={() => requestOpenApp(id, name)}
          >
            Open
          </Button>
          {isOutdated && (
            <Button
              className={classes.actionButton}
              color="primary"
              size="medium"
              onClick={() => onUpdateApp(engine, id, name, url, icon)}
            >
              Update
            </Button>
          )}
          {!isOutdated && (
            <Button
              className={classes.actionButton}
              color="secondary"
              size="medium"
              onClick={() => requestUninstallApp(id, name, engine)}
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
      <Button
        className={classes.actionButton}
        color="primary"
        size="medium"
        disabled={status !== null}
        onClick={() => onOpenDialogChooseEngine(id, name, url, icon)}
      >
        {label}
      </Button>
    );
  };

  return (
    <Grid item>
      <Paper elevation={0} className={classes.card}>
        <img
          alt={name}
          className={classes.paperIcon}
          src={icon128 || (isUrl(icon) ? icon : `file://${icon}`)}
        />
        <Typography variant="subtitle2" className={classes.appName}>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
          {url ? extractHostname(url) : '-'}
        </Typography>

        <div className={classes.actionContainer}>
          {renderActionsElement()}
        </div>
        {!url && (
          <Tooltip title="What is this?" placement="right">
            <IconButton
              size="small"
              aria-label="What is this?"
              classes={{ root: classes.topLeft }}
              onClick={onOpenDialogContextAppHelp}
            >
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
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
              <Divider key={`menu-divider-${id}`} />,
              <MenuItem dense key={`menu-engine-${id}`} onClick={null} disabled>
                Installed with&nbsp;
                {getEngineName(engine)}
              </MenuItem>,
              engine === 'electron' && version && (
                <MenuItem dense key={`menu-version-${id}`} onClick={null} disabled>
                  Version&nbsp;
                  {version}
                  {isOutdated && (
                    <span>
                      &nbsp;(Latest:&nbsp;
                      {latestTemplateVersion}
                      )
                    </span>
                  )}
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
  icon128: null,
  latestTemplateVersion: null,
  status: null,
  url: null,
  version: null,
};

AppCard.propTypes = {
  cancelable: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  engine: PropTypes.string,
  icon128: PropTypes.string,
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isOutdated: PropTypes.bool.isRequired,
  latestTemplateVersion: PropTypes.string,
  name: PropTypes.string.isRequired,
  onOpenDialogChooseEngine: PropTypes.func.isRequired,
  onOpenDialogContextAppHelp: PropTypes.func.isRequired,
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
  openDialogChooseEngine,
  openDialogContextAppHelp,
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
