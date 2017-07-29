import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppCard from '../Shared/AppCard';

const styleSheet = createStyleSheet('Installed', theme => ({
  scrollContainer: {
    flex: 1,
    padding: 36,
    overflow: 'auto',
    boxSizing: 'border-box',
  },

  card: {
    width: 200,
    boxSizing: 'border-box',
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
    position: 'relative',
    backgroundColor: grey[100],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  domainText: {
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: theme.spacing.unit,
  },
  cardActions: {
    justifyContent: 'center',
  },

  rightButton: {
    marginLeft: theme.spacing.unit,
  },
  iconButton: {
    margin: 0,
  },

  moreIconMenu: {
    position: 'absolute',
    transform: 'translate(58px, -16px)',
  },
  hiddenMenuItem: {
    display: 'none',
  },
}));

const Installed = (props) => {
  const {
    classes,
    apps,
  } = props;

  return (
    <div
      className={classes.scrollContainer}
    >
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center" gutter={24}>
            {apps.map(app => <AppCard app={app} />)}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Installed.propTypes = {
  classes: PropTypes.object.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => {
  const { managedApps } = state.user.apps.managed.apps;
  const apps = [];
  Object.keys(managedApps).forEach((id) => {
    const { status, app } = managedApps[id];
    const acceptedStatuses = ['INSTALLED', 'UPDATING', 'INSTALLING'];
    if (acceptedStatuses.indexOf(status) > -1) {
      apps.push(app);
    }
  });

  return { apps };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Installed));
