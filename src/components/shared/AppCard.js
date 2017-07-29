/* global ipcRenderer */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddBoxIcon from 'material-ui-icons/AddBox';
import CheckBoxIcon from 'material-ui-icons/CheckBox';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import blue from 'material-ui/colors/blue';
import Typography from 'material-ui/Typography';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppCardMoreMenuButton from './AppCardMoreMenuButton';

import extractHostname from '../../tools/extractHostname';

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
    buttonInstalled: {
      color: blue[500],
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
      width: 200,
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
      width: 60,
      height: 'auto',
    },

    titleText: {
      fontWeight: 500,
      lineHeight: 1.5,
      marginTop: theme.spacing.unit,
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
  } = props;

  const handleOpenApp = () => {
    ipcRenderer.send('open-app', app.id, app.name);
  };

  const actionsElement = isInstalled
    ? (
      <Button
        className={classes.buttonInstalled}
        onClick={handleOpenApp}
      >
        <CheckBoxIcon color="inherit" />
        <span className={classes.buttonText}>Installed</span>
      </Button>
    ) : (
      <Button className={classes.button}>
        <AddBoxIcon color="inherit" />
        <span className={classes.buttonText}>Install</span>
      </Button>
    );

  return (
    <Grid key={app.id} item>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <AppCardMoreMenuButton
            name={app.name}
            url={app.url}
            onOpenApp={handleOpenApp}
          />
          <img src={`https://getwebcatalog.com/s3/${app.id}.webp`} alt="Messenger" className={classes.paperIcon} />
          <Typography type="subheading" className={classes.appName}>
            {app.name}
          </Typography>
          <Typography type="heading2" color="secondary">
            {extractHostname(app.url)}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          {actionsElement}
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
};

const mapStateToProps = (state, ownProps) => {
  const { app } = ownProps;

  const status = state.core.managedApps[app.id] ? state.core.managedApps[app.id].status : 'NOT_INSTALLED';

  return {
    isInstalled: status === 'INSTALLED',
  };
};

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(AppCard));
