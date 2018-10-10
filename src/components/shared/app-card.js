import isUrl from 'is-url';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GetAppIcon from '@material-ui/icons/GetApp';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import connectComponent from '../../helpers/connect-component';

import extractHostname from '../../helpers/extract-hostname';
import { open as openConfirmUninstallAppDialog } from '../../state/dialogs/confirm-uninstall-app/actions';
import { installApp } from '../../state/root/local/actions';

import {
  isInstalled as isInstalledUtil,
  isInstalling as isInstallingUtil,
  isUninstalling as isUninstallingUtil,
} from '../../state/root/local/utils';

import linuxCategoryMappings from '../../constants/linux-category-mappings';
import {
  STRING_INSTALL,
  STRING_INSTALLING,
  STRING_OPEN,
  STRING_UNINSTALL,
  STRING_UNINSTALLING,
} from '../../constants/strings';

import { requestOpenApp } from '../../senders/local';

import electronIcon from '../../assets/default-icon.png';


const styles = (theme) => {
  return {
    button: {
      color: grey[600],
      '&:not(:first-child)': {
        marginLeft: 12,
      },
    },
    scrollContainer: {
      boxSizing: 'border-box',
      flex: 1,
      overflow: 'auto',
      padding: 36,
    },
    buttonText: {
      fontSize: 12,
      marginLeft: 6,
      transform: 'translateY(-1px)',
    },
    card: {
      width: 250,
      boxSizing: 'border-box',
      background: theme.palette.common.white,
      borderRadius: 4,
      padding: theme.spacing.unit * 2,
      border: '1px solid #BDBDBD',
    },
    appName: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      lineHeight: 1,
    },
    paperIcon: {
      width: 48,
      height: 48,
    },
    domainText: {
      fontWeight: 400,
      lineHeight: 1,
      marginBottom: theme.spacing.unit,
    },
    split: {
      display: 'flex',
      overflow: 'hidden',
    },
    splitRight: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.unit * 2,
    },
    actionContainer: {
      marginTop: theme.spacing.unit * 2.5,
    },
    actionButton: {
      marginRight: theme.spacing.unit,
      minWidth: 'auto',
      boxShadow: 'none',
    },
  };
};

const AppCard = (props) => {
  const {
    app,
    classes,
    isInstalled,
    isInstalling,
    isUninstalling,
    onInstallApp,
    onOpenConfirmUninstallAppDialog,
  } = props;

  const handleOpenApp = () => {
    requestOpenApp(app.id, app.name);
  };

  const renderActionsElement = () => {
    if (isInstalled) {
      return (
        <div>
          <Button
            className={classes.actionButton}
            size="small"
            variant="contained"
            onClick={handleOpenApp}
          >
            <span>{STRING_OPEN}</span>
          </Button>
          <Button
            className={classes.actionButton}
            color="secondary"
            size="small"
            variant="contained"
            onClick={() => onOpenConfirmUninstallAppDialog({ app })}
          >
            <span>{STRING_UNINSTALL}</span>
          </Button>
        </div>
      );
    }

    let label;
    if (isInstalling) label = STRING_INSTALLING;
    else if (isUninstalling) label = STRING_UNINSTALLING;
    else label = STRING_INSTALL;

    return (
      <Button
        className={classes.actionButton}
        color="primary"
        size="small"
        variant="contained"
        disabled={isInstalling || isUninstalling}
        onClick={() => {
          // for Linux
          const modifiedApp = Object.assign({}, app, {
            category: linuxCategoryMappings[app.category],
          });

          onInstallApp(modifiedApp);
        }}
      >
        <span>{label}</span>
      </Button>
    );
  };

  let icon = electronIcon;
  if (app.icon && !isUrl(app.icon)) icon = `file://${app.icon}`;
  else if (app.icon128) icon = app.icon128;
  else if (app.icon) icon = app.icon; // eslint-disable-line prefer-destructuring

  return (
    <Grid key={app.id} item>
      <div className={classes.card}>
        <div className={classes.split}>
          <div className={classes.splitLeft}>
            <img
              alt={app.name}
              className={classes.paperIcon}
              src={icon}
            />
          </div>
          <div className={classes.splitRight}>
            <div>
              <Typography variant="subheading" className={classes.appName}>
                {app.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {extractHostname(app.url)}
              </Typography>

              <div className={classes.actionContainer}>
                {renderActionsElement()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isInstalled: PropTypes.bool.isRequired,
  isInstalling: PropTypes.bool.isRequired,
  isUninstalling: PropTypes.bool.isRequired,
  onInstallApp: PropTypes.func.isRequired,
  onOpenConfirmUninstallAppDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { app } = ownProps;

  const isInstalled = isInstalledUtil(state, app.id);

  return {
    isInstalled,
    isInstalling: isInstallingUtil(state, app.id),
    isUninstalling: isUninstallingUtil(state, app.id),
    isDeprecated: isInstalled && !app.icon,
  };
};

const actionCreators = {
  installApp,
  openConfirmUninstallAppDialog,
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
