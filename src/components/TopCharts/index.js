import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LinearProgress } from 'material-ui/Progress';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

import AppCard from '../shared/AppCard';
import getCategoryLabel from '../../utils/getCategoryLabel';
import {
  setSortBy,
  getApps,
} from '../../state/topCharts/actions';

import FilterMenuButton from './FilterMenuButton';
import NoConnection from '../shared/NoConnection';

const styleSheet = createStyleSheet('TopCharts', () => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    zIndex: 1,
    display: 'flex',
    paddingLeft: 12,
    paddingRight: 12,
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
    padding: 36,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  grid: {
    marginBottom: 16,
  },
}));

class TopCharts extends React.Component {
  componentDidMount() {
    const {
      onGetApps,
    } = this.props;

    onGetApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetApps({ next: true });
      }
    };
  }

  render() {
    const {
      apps,
      category,
      classes,
      hasFailed,
      isGetting,
      onGetApps,
      onSetSortBy,
      sortBy,
    } = this.props;

    let tabIndex = 0;
    if (sortBy === 'createdAt') tabIndex = 1;

    const categoryLabel = getCategoryLabel(category);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.buttonContainer} />

          <Tabs
            className={classes.tabs}
            index={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            centered
            onChange={(event, index) => {
              if (index === 0) return onSetSortBy('installCount', 'desc');

              return onSetSortBy('createdAt', 'desc');
            }}
          >
            <Tab label={category ? `Top Apps in ${categoryLabel}` : 'Top Apps'} />
            <Tab label={category ? `New Apps in ${categoryLabel}` : 'New Apps'} />
          </Tabs>

          <div className={classes.buttonContainer}>
            <FilterMenuButton />
          </div>
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
};

TopCharts.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  category: PropTypes.string,
  classes: PropTypes.object.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onGetApps: PropTypes.func.isRequired,
  onSetSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    apiData,
    hasFailed,
    isGetting,
    queryParams,
  } = state.topCharts;

  const {
    apps,
  } = apiData;

  const {
    category,
    sortBy,
  } = queryParams;

  return {
    apps,
    category,
    hasFailed,
    isGetting,
    sortBy,
  };
};

const mapDispatchToProps = dispatch => ({
  onGetApps: optionsObject => dispatch(getApps(optionsObject)),
  onSetSortBy: (sortBy, sortOrder) => dispatch(setSortBy(sortBy, sortOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(TopCharts));
