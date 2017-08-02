/* global ipcRenderer */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import DeleteIcon from 'material-ui-icons/Delete';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import GetAppIcon from 'material-ui-icons/GetApp';
import grey from 'material-ui/colors/grey';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import AppCardMoreMenuButton from './AppCardMoreMenuButton';

import extractHostname from '../../utils/extractHostname';
import { open as openConfirmUninstallAppDialog } from '../../state/ui/dialogs/confirm-uninstall-app/actions';
import { installApp } from '../../state/local/actions';
import {
  isInstalled as isInstalledUtil,
  isUninstalling as isUninstallingUtil,
  isInstalling as isInstallingUtil,
} from '../../state/local/utils';

const styleSheet = createStyleSheet('Home', (theme) => {
  const cardContentDefaults = {
    position: 'relative',
    backgroundColor: grey[100],
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
      width: 240,
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
      fontSize: 16,
    },
    appUrl: {
      fontSize: 14,
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
});

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
    ipcRenderer.send('open-app', app.id, app.name);
  };

  const renderActionsElement = () => {
    if (isInstalled) {
      return (
        <div>
          <Button
            className={classes.button}
            onClick={handleOpenApp}
          >
            <ExitToAppIcon color="inherit" />
            <span className={classes.buttonText}>Open</span>
          </Button>
          <Button
            className={classes.button}
            onClick={() => onOpenConfirmUninstallAppDialog({ app })}
          >
            <DeleteIcon color="inherit" />
            <span className={classes.buttonText}>Uninstall</span>
          </Button>
        </div>
      );
    }

    if (isInstalling || isUninstalling) {
      return (<div>Loading...</div>);
    }

    return (
      <Button
        className={classes.button}
        onClick={() => onInstallApp(app.id, app.name)}
      >
        <GetAppIcon color="inherit" />
        <span className={classes.buttonText}>Install</span>
      </Button>
    );
  };

  return (
    <Grid key={app.id} item>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <AppCardMoreMenuButton
            app={app}
            isInstalled={isInstalled}
            id={app.id}
            name={app.name}
            url={app.url}
            onOpenApp={handleOpenApp}
          />
          <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
          <Typography type="subheading" className={classes.appName}>
            {app.name}
          </Typography>
          <Typography type="display2" color="secondary" className={classes.appUrl}>
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

  return {
    isInstalled: isInstalledUtil(state, app.id),
    isInstalling: isInstallingUtil(state, app.id),
    isUninstalling: isUninstallingUtil(state, app.id),
  };
};

const mapDispatchToProps = dispatch => ({
  onInstallApp: (id, name) => dispatch(installApp(id, name)),
  onOpenConfirmUninstallAppDialog: form => dispatch(openConfirmUninstallAppDialog(form)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(AppCard));
