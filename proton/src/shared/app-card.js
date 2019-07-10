import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import GetAppIcon from 'material-ui-icons/GetApp';
import grey from 'material-ui/colors/grey';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';

import connectComponent from '../helpers/connect-component';
import extractHostname from '../helpers/extract-hostname';

import { STRING_INSTALL } from '../constants/strings';

const styles = (theme) => {
  const cardContentDefaults = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

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
      padding: 0,
      width: '90vw',
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
    linearProgress: {
      marginTop: -5,
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
    isInstalling,
    isUninstalling,
    onInstallApp,
  } = props;

  const cardLinearProgresss = isInstalling || isUninstalling
    ? <LinearProgress className={classes.linearProgress} />
    : null;

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
          <Button
            color="primary"
            dense
            disabled={isInstalling || isUninstalling}
            onClick={() => onInstallApp(app.id, app.name)}
          >
            <GetAppIcon color="inherit" />
            <span className={classes.buttonText}>{STRING_INSTALL}</span>
          </Button>
        </CardActions>
        {cardLinearProgresss}
      </Card>
    </Grid>
  );
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isInstalling: PropTypes.bool.isRequired,
  isUninstalling: PropTypes.bool.isRequired,
  onInstallApp: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const actionCreators = {
};

export default connectComponent(
  AppCard,
  mapStateToProps,
  actionCreators,
  styles,
);
