import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

const styles = (theme) => ({
  card: {
    width: 180,
    height: 155,
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing.unit,
    textAlign: 'center',
    position: 'relative',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    marginTop: theme.spacing.unit,
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
    marginTop: theme.spacing.unit,
  },
  actionButton: {
    minWidth: 'auto',
    boxShadow: 'none',
    fontSize: '0.8em',
  },
  topRight: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
    color: theme.palette.text.secondary,
    padding: theme.spacing.unit,
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
    onOpenDialogCreateCustomApp,
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
              onClick={() => requestUninstallApp(id, name)}
            >
              Uninstall
            </Button>
          )}
        </div>
      );
    }

    let label = 'Install';
    if (status === INSTALLING && version) {
      if (cancelable) label = 'Waiting to Update...';
      else label = 'Updating...';
    } else if (status === INSTALLING) {
      if (cancelable) label = 'Waiting to Install...';
      else label = 'Installing...';
    } else if (status === UNINSTALLING) label = 'Uninstalling...';

    return (
      <Button
        className={classes.actionButton}
        color="primary"
        size="medium"
        disabled={status !== null}
        onClick={() => onOpenDialogChooseEngine(id, name, url, icon)}
      >
        <span>{label}</span>
      </Button>
    );
  };

  return (
    <Grid item>
      <Paper elevation={1} className={classes.card}>
        <img
          alt={name}
          className={classes.paperIcon}
          src={icon128 || (isUrl(icon) ? icon : `file://${icon}`)}
        />
        <Typography variant="subtitle2" className={classes.appName}>
          {name}
        </Typography>
        <Typography variant="body1" color="textSecondary" className={classes.appUrl}>
          {extractHostname(url)}
        </Typography>

        <div className={classes.actionContainer}>
          {renderActionsElement()}
        </div>
        <StatedMenu
          id={`more-menu-${id}`}
          buttonElement={(
            <IconButton aria-label="Delete" classes={{ root: classes.topRight }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        >
          {status === INSTALLING && cancelable && (
            <MenuItem
              onClick={() => {
                if (version) return requestCancelUpdateApp(id);
                return requestCancelInstallApp(id);
              }}
            >
              {version ? 'Cancel Update' : 'Cancel Installation'}
            </MenuItem>
          )}
          {status === INSTALLED && isOutdated && (
            <MenuItem onClick={() => requestUninstallApp(id, name)}>
              Uninstall
            </MenuItem>
          )}
          <MenuItem
            onClick={() => onOpenDialogCreateCustomApp({
              name: `${name} 2`,
              url,
              icon,
            })}
          >
            Create Custom App from&nbsp;
            {name}
          </MenuItem>
          {engine && (
            <>
              <Divider />
              <MenuItem onClick={null} disabled>
                Installed with&nbsp;
                {getEngineName(engine)}
              </MenuItem>
              {engine === 'electron' && version && (
                <MenuItem onClick={null} disabled>
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
              )}
            </>
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
  onOpenDialogCreateCustomApp: PropTypes.func.isRequired,
  onUpdateApp: PropTypes.func.isRequired,
  status: PropTypes.string,
  url: PropTypes.string.isRequired,
  version: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const app = state.appManagement.apps[ownProps.id];

  return {
    isOutdated: isOutdatedApp(ownProps.id, state),
    latestTemplateVersion: state.general.latestTemplateVersion,
    status: app ? app.status : null,
    engine: app ? app.engine : null,
    version: app ? app.version : null,
    cancelable: app ? app.cancelable : false,
  };
};

const actionCreators = {
  openDialogChooseEngine,
  openDialogCreateCustomApp,
  updateApp,
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
