import React from 'react';

import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';
import {
  INSTALLED,
  UPDATING,
  INSTALLING,
} from '../../../constants/app-statuses';
import {
  STRING_NO_INSTALLED_APPS_DESC,
  STRING_NO_INSTALLED_APPS,
  STRING_UPDATE_ALL,
  STRING_UPDATES_AVAILABLE,
} from '../../../constants/strings';

import { updateAllApps } from '../../../state/root/local/actions';
import { getAvailableUpdateCount } from '../../../state/root/local/utils';

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
  updateAllButton: {
    marginLeft: theme.spacing.unit,
  },
});

const Installed = (props) => {
  const {
    apps,
    availableUpdateCount,
    classes,
    onUpdateAllApps,
  } = props;

  return (
    <div className={classes.scrollContainer}>
      <div className={classes.headerContainer}>
        <Typography type="body1">
          {STRING_UPDATES_AVAILABLE} ({availableUpdateCount})
        </Typography>
        <Button
          className={classes.updateAllButton}
          color="primary"
          onClick={onUpdateAllApps}
          disabled={availableUpdateCount < 1}
        >
          {STRING_UPDATE_ALL}
        </Button>
      </div>


      {(apps.length > 0) ? (
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={24}>
              {apps.map(app => <AppCard key={app.id} app={app} />)}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <EmptyState
          icon={FileDownloadIcon}
          title={STRING_NO_INSTALLED_APPS}
        >
          {STRING_NO_INSTALLED_APPS_DESC}
        </EmptyState>
      )}
    </div>
  );
};

Installed.defaultProps = {
  availableUpdateCount: 0,
};

Installed.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  availableUpdateCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const managedApps = state.local.apps;
  const apps = [];
  Object.keys(managedApps).forEach((id) => {
    const { status, app } = managedApps[id];
    const acceptedStatuses = [INSTALLED, UPDATING, INSTALLING];
    if (acceptedStatuses.indexOf(status) > -1) {
      apps.push(app);
    }
  });

  return {
    apps,
    availableUpdateCount: getAvailableUpdateCount(state),
  };
};

const actionCreators = {
  updateAllApps,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
