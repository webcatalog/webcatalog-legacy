import React from 'react';

import PropTypes from 'prop-types';

import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import connectComponent from '../../helpers/connect-component';

import { updateAllApps } from '../../actions/root/local/actions';
import { getAvailableUpdateCount } from '../../reducers/root/local/utils';
import { changeRoute } from '../../actions/root/router/actions';
import {
  getApps,
  resetAndGetApps,
} from '../../actions/pages/top-charts/actions';

import {
  STRING_UPDATE_ALL,
  STRING_UPDATES_AVAILABLE,
  STRING_VIEW,
} from '../../constants/strings';

import { ROUTE_INSTALLED_APPS } from '../../constants/routes';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tab: {
    width: 225,
  },
  paper: {
    zIndex: 1,
    display: 'flex',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  tabs: {
    flex: 1,
    boxSizing: 'border-box',
  },
  buttonContainer: {
    flex: '0 0 48px',
  },
  scrollContainer: {
    flex: 1,
    padding: theme.spacing.unit * 2,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  grid: {
    marginBottom: theme.spacing.unit,
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

class TopCharts extends React.Component {
  componentDidMount() {
    const {
      onGetApps,
      onResetAndGetApps,
    } = this.props;

    onResetAndGetApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetApps();
      }
    };
  }

  render() {
    const {
      apps,
      availableUpdateCount,
      classes,
      hasFailed,
      isGetting,
      onChangeRoute,
      onGetApps,
      onUpdateAllApps,
    } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.buttonContainer} />
        </Paper>
        <div
          className={classes.scrollContainer}
          ref={(container) => { this.scrollContainer = container; }}
        >
          {hasFailed ? (
            <NoConnection
              onTryAgainButtonClick={onGetApps}
            />
          ) : (
            <Grid container className={classes.grid}>
              <Grid item xs={12}>
                {availableUpdateCount > 0 && (
                  <div className={classes.headerContainer}>
                    <Typography type="body1">
                      {STRING_UPDATES_AVAILABLE} ({availableUpdateCount})
                    </Typography>
                    <Button
                      className={classes.updateAllButton}
                      color="primary"
                      onClick={() => onChangeRoute(ROUTE_INSTALLED_APPS)}
                    >
                      {STRING_VIEW}
                    </Button>
                    <Button
                      className={classes.updateAllButton}
                      color="primary"
                      onClick={onUpdateAllApps}
                    >
                      {STRING_UPDATE_ALL}
                    </Button>
                  </div>
                )}
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="center" spacing={24}>
                  {apps.map(app => <AppCard key={app.id} app={app} />)}
                </Grid>
              </Grid>
            </Grid>
          )}
          {isGetting && (<LinearProgress />)}
        </div>
      </div>
    );
  }
}

TopCharts.defaultProps = {
  category: null,
  sortBy: null,
  availableUpdateCount: 0,
};

TopCharts.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  availableUpdateCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onGetApps: PropTypes.func.isRequired,
  onResetAndGetApps: PropTypes.func.isRequired,
  onUpdateAllApps: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    apiData,
    hasFailed,
    isGetting,
    queryParams,
  } = state.pages.topCharts;

  const {
    apps,
  } = apiData;

  const {
    category,
    sortBy,
  } = queryParams;

  return {
    apps,
    availableUpdateCount: getAvailableUpdateCount(state),
    category,
    hasFailed,
    isGetting,
    sortBy,
  };
};

const actionCreators = {
  changeRoute,
  getApps,
  resetAndGetApps,
  updateAllApps,
};

export default connectComponent(
  TopCharts,
  mapStateToProps,
  actionCreators,
  styles,
);
