import isUrl from 'is-url';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import GetAppIcon from '@material-ui/icons/GetApp';
import grey from '@material-ui/core/colors/grey';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

import extractHostname from '../../helpers/extract-hostname';

import { STRING_ADD } from '../../constants/strings';

import { open as openDialogAddWorkspace } from '../../state/dialogs/add-workspace/actions';

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
      width: 64,
      height: 64,
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
    onOpenDialogAddWorkspace,
  } = props;

  let icon = null;
  if (app.icon && !isUrl(app.icon)) icon = `file://${app.icon}`;
  else if (app.icon128) icon = app.icon128;
  else if (app.icon) icon = app.icon; // eslint-disable-line prefer-destructuring

  return (
    <Grid key={app.id} item>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <img
            alt={app.name}
            className={classes.paperIcon}
            src={icon}
          />
          <Typography variant="subheading" className={classes.appName}>
            {app.name}
          </Typography>

          <Typography variant="body1" color="textSecondary">
            {extractHostname(app.url)}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            color="primary"
            size="small"
            onClick={() => {
              onOpenDialogAddWorkspace({
                name: app.name,
                url: app.url,
                icon: app.icon,
              });
            }}
          >
            <GetAppIcon color="inherit" />
            <span className={classes.buttonText}>{STRING_ADD}</span>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

AppCard.propTypes = {
  app: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  onOpenDialogAddWorkspace: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogAddWorkspace,
};

export default connectComponent(
  AppCard,
  null,
  actionCreators,
  styles,
);
