
import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import DeleteIcon from 'material-ui-icons/Delete';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import GetAppIcon from 'material-ui-icons/GetApp';
import grey from 'material-ui/colors/grey';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';

import extractHostname from '../helpers/extract-hostname';
import { open as openConfirmUninstallAppDialog } from '../state/dialogs/confirm-uninstall-app/actions';
import { installApp } from '../state/root/local/actions';

import {
  isInstalled as isInstalledUtil,
  isUninstalling as isUninstallingUtil,
  isInstalling as isInstallingUtil,
  getMoleculeVersion,
} from '../state/root/local/utils';

import {
  STRING_INSTALL,
  STRING_OPEN,
  STRING_UNINSTALL,
  STRING_UPDATE,
} from '../constants/strings';

import { requestOpenApp } from '../senders/local';

import getCurrentMoleculeVersion from '../helpers/get-current-molecule-version';

const styles = (theme) => {
  const cardContentDefaults = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return {
    button: {
      color: grey[600],
    },
    scrollContainer: {
      flex: 1,
      padding: 36,
      overflow: 'auto',
      boxSizing: 'border-box',
    },
    buttonText: {
      fontSize: 12,
      marginLeft: 6,
      transform: 'translateY(-1px)',
    },
    cardHeader: {
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%',
    },

    card: {
      width: 248,
      boxSizing: 'border-box',
    },

    cardIsViewing: {
      width: '90vw',
      padding: 0,
    },

    appName: {
      marginTop: 16,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    paperIcon: {
      width: 72,
      height: 72,
    },

    cardContent: {
      ...cardContentDefaults,
    },

    cardContentIsViewing: {
      ...cardContentDefaults,
      backgroundColor: 'white',
      padding: 0,
    },

    domainText: {
      fontWeight: 400,
      lineHeight: 1,
      marginBottom: theme.spacing.unit,
    },
    cardActions: {
      justifyContent: 'center',
      overflow: 'hidden',
    },
    linearProgressContainer: {
      flex: 1,
      padding: '0 16px',
    },
    rightButton: {
      marginLeft: theme.spacing.unit,
    },
    iconButton: {
      margin: 0,
    },

    moreIconMenu: {
      position: 'absolute',
      transform: 'translate(82px, -16px)',
    },
    hiddenMenuItem: {
      display: 'none',
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
    moleculeVersion,
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
          {moleculeVersion === getCurrentMoleculeVersion() ? (
            <Button
              className={classes.button}
              onClick={handleOpenApp}
            >
              <ExitToAppIcon color="inherit" />
              <span className={classes.buttonText}>{STRING_OPEN}</span>
            </Button>
          ) : (
            <Button
              className={classes.button}
              onClick={() => onInstallApp(app.id, app.name)}
            >
              <GetAppIcon color="inherit" />
              <span className={classes.buttonText}>{STRING_UPDATE}</span>
            </Button>
          )}
          <Button
            color="accent"
            onClick={() => onOpenConfirmUninstallAppDialog({ app })}
          >
            <DeleteIcon color="inherit" />
            <span className={classes.buttonText}>{STRING_UNINSTALL}</span>
          </Button>
        </div>
      );
    }

    if (isInstalling || isUninstalling) {
      return (
        <div className={classes.linearProgressContainer}><LinearProgress /></div>
      );
    }

    return (
      <Button
        color="primary"
        onClick={() => onInstallApp(app.id, app.name)}
      >
        <GetAppIcon color="inherit" />
        <span className={classes.buttonText}>{STRING_INSTALL}</span>
      </Button>
    );
  };

  return (
    <Grid key={app.id} item>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <img src={`https://webcatalog.io/s3/${app.id}@128px.webp`} alt="Messenger" className={classes.paperIcon} />
          <Typography type="subheading" className={classes.appName}>
            {app.name}
          </Typography>
          <Typography type="body1" color="secondary" className={classes.appUrl}>
            {extractHostname(app.url)}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {renderActionsElement()}
        </CardActions>
      </Card>
    </Grid>
  );
};

AppCard.defaultProps = {
  moleculeVersion: '0.0.0',
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isInstalled: PropTypes.bool.isRequired,
  isInstalling: PropTypes.bool.isRequired,
  isUninstalling: PropTypes.bool.isRequired,
  moleculeVersion: PropTypes.string,
  onInstallApp: PropTypes.func.isRequired,
  onOpenConfirmUninstallAppDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { app } = ownProps;

  return {
    isInstalled: isInstalledUtil(state, app.id),
    isInstalling: isInstallingUtil(state, app.id),
    isUninstalling: isUninstallingUtil(state, app.id),
    moleculeVersion: getMoleculeVersion(state, app.id),
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
