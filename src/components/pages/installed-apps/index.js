import React from 'react';

import PropTypes from 'prop-types';

import FileDownloadIcon from 'material-ui-icons/FileDownload';
import Grid from 'material-ui/Grid';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';
import {
  INSTALLED,
  INSTALLING,
} from '../../../constants/app-statuses';
import {
  STRING_NO_INSTALLED_APPS_DESC,
  STRING_NO_INSTALLED_APPS,
} from '../../../constants/strings';

const styles = theme => ({
  scrollContainer: {
    flex: 1,
    padding: theme.spacing.unit * 2,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.unit * 2,
  },
});

const Installed = (props) => {
  const {
    apps,
    classes,
  } = props;

  return (
    <div className={classes.scrollContainer}>
      <Grid container>
        <Grid item xs={12}>
          {(apps.length > 0) ? (
            <Grid container justify="center" spacing={24}>
              {apps.map(app => <AppCard key={app.id} app={app} />)}
            </Grid>
          ) : (
            <EmptyState
              icon={FileDownloadIcon}
              title={STRING_NO_INSTALLED_APPS}
            >
              {STRING_NO_INSTALLED_APPS_DESC}
            </EmptyState>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

Installed.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const managedApps = state.local.apps;
  const apps = [];
  Object.keys(managedApps).forEach((id) => {
    const { status, app } = managedApps[id];
    const acceptedStatuses = [INSTALLED, INSTALLING];
    if (acceptedStatuses.indexOf(status) > -1) {
      apps.push(app);
    }
  });

  return {
    apps,
  };
};


export default connectComponent(
  Installed,
  mapStateToProps,
  null,
  styles,
);
