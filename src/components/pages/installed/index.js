import React from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import GetAppIcon from '@material-ui/icons/GetApp';

import connectComponent from '../../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';

import { fetchLatestTemplateVersionAsync } from '../../../state/general/actions';
import { updateAllApps } from '../../../state/app-management/actions';
import { getCancelableAppsAsList, getOutdatedAppsAsList, filterApps } from '../../../state/app-management/utils';

import { requestCancelInstallApp, requestCancelUpdateApp } from '../../../senders';

const styles = (theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
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
    flexDirection: 'row',
  },
  pendingUpdates: {
    paddingLeft: theme.spacing.unit,
  },
  updateAllButton: {
    marginLeft: theme.spacing.unit,
  },
});

const Installed = (props) => {
  const {
    apps,
    cancelableAppsAsList,
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
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
      </Grid>
      <div className={classes.scrollContainer}>
        <Grid spacing={16} container className={classes.grid}>
          <Grid item xs={12}>
            <div className={classes.updateAllFlexRoot}>
              <div className={classes.updateAllFlexLeft}>
                <Typography variant="body1" color="default" className={classes.pendingUpdates}>
                  <span>{outdatedAppCount}</span>
                  <span>&nbsp;Pending Updates</span>
                </Typography>
                {outdatedAppCount > 0 && (
                  <Button
                    className={classes.updateAllButton}
                    onClick={onUpdateAllApps}
                    size="small"
                  >
                    Update All
                  </Button>
                )}
                {cancelableAppsAsList.length > 0 && (
                  <Button
                    className={classes.updateAllButton}
                    onClick={() => {
                      cancelableAppsAsList.forEach((app) => {
                        if (app.version) return requestCancelUpdateApp(app.id);
                        return requestCancelInstallApp(app.id);
                      });
                    }}
                    size="small"
                  >
                    Cancel All
                  </Button>
                )}
              </div>

              <Button
                disabled={fetchingLatestTemplateVersion}
                onClick={onFetchLatestTemplateVersionAsync}
                size="small"
              >
                {fetchingLatestTemplateVersion ? 'Checking for Updates...' : 'Check for Updates'}
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
  cancelableAppsAsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  fetchingLatestTemplateVersion: PropTypes.bool.isRequired,
  onFetchLatestTemplateVersionAsync: PropTypes.func.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  query: PropTypes.string,
};

const mapStateToProps = (state) => ({
  apps: filterApps(state.appManagement.apps, state.installed.query),
  cancelableAppsAsList: getCancelableAppsAsList(state),
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
