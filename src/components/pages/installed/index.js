import React from 'react';

import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';
import { updateAllApps } from '../../../state/app-management/actions';
import { getOutdatedAppsAsList, filterApps } from '../../../state/app-management/utils';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  toolbar: {
    minHeight: '56px !important',
  },
  title: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  grid: {
    minHeight: '100%',
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
  updateAllFlexRoot: {
    display: 'flex',
  },
  updateAllFlexLeft: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },
});

const Installed = (props) => {
  const {
    apps,
    classes,
    fetchingLatestTemplateVersion,
    onFetchLatestTemplateVersionAsync,
    onUpdateAllApps,
    outdatedAppCount,
    query,
  } = props;

  const renderContent = () => {
    if (Object.keys(apps).length > 0) {
      return (
        <Grid container justify="center" spacing={16}>
          {Object.values(apps).map((app) => (
            <AppCard
              key={app.id}
              id={app.id}
              name={app.name}
              url={app.url}
              icon={app.icon}
              status={app.status}
              engine={app.engine}
              version={app.version}
            />
          ))}
        </Grid>
      );
    }

    if (query) {
      return (
        <EmptyState
          icon={SearchIcon}
          title="No Matching Results"
        >
          Your search -&nbsp;
          <b>{query}</b>
          &nbsp;- did not match any installed apps.
        </EmptyState>
      );
    }

    return (
      <EmptyState
        icon={GetAppIcon}
        title="No Installed Apps"
      >
        Your installed apps on this machine will show up here.
      </EmptyState>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar} elevation={2}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" className={classes.title}>
            Installed Apps
          </Typography>
          <Button
            color="inherit"
            disabled={fetchingLatestTemplateVersion}
            onClick={onFetchLatestTemplateVersionAsync}
          >
            {fetchingLatestTemplateVersion ? 'Checking for Updates...' : 'Check for Updates'}
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div className={classes.scrollContainer}>
        <Grid spacing={16} container className={classes.grid}>
          <Grid item xs={12}>
            <div className={classes.updateAllFlexRoot}>
              <Typography variant="body1" color="default" className={classes.updateAllFlexLeft}>
                <span>{outdatedAppCount}</span>
                <span>&nbsp;Pending Updates</span>
              </Typography>

              <Button disabled={outdatedAppCount < 1} onClick={onUpdateAllApps}>
                Update All
              </Button>
            </div>
            <Divider className={classes.divider} />
            {renderContent()}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

Installed.defaultProps = {
  query: null,
};

Installed.propTypes = {
  apps: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  fetchingLatestTemplateVersion: PropTypes.bool.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = (state) => ({
  apps: filterApps(state.appManagement.apps, state.installed.query),
  fetchingLatestTemplateVersion: state.general.fetchingLatestTemplateVersion,
  outdatedAppCount: getOutdatedAppsAsList(state).length,
  query: state.installed.query,
});

const actionCreators = {
  fetchLatestTemplateVersionAsync,
  updateAllApps,
};

export default connectComponent(
  Installed,
  mapStateToProps,
  actionCreators,
  styles,
);
