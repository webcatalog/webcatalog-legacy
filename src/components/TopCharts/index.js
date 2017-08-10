import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LinearProgress } from 'material-ui/Progress';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

import AppCard from '../shared/AppCard';
import DialogAccount from '../dialogs/Account';
import DialogAbout from '../dialogs/About';
import DialogSubmitApp from '../dialogs/SubmitApp';
import DialogConfirmUninstallApp from '../dialogs/ConfirmUninstallApp';
import DialogFeedback from '../dialogs/Feedback';
import { getUser } from '../../state/user/actions';
import { getUserApps } from '../../state/user/apps/actions';
import getCategoryLabel from '../../utils/getCategoryLabel';
import {
  setSortBy,
  getApps,
} from '../../state/topCharts/actions';

import FilterMenuButton from './FilterMenuButton';

const styleSheet = createStyleSheet('Apps', () => ({
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

class Apps extends React.Component {
  componentDidMount() {
    const {
      onGetApps,
      onGetUserApps,
      onGetUser,
    } = this.props;

    onGetUser();
    onGetUserApps();
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
      isGetting,
      onSetSortBy,
      sortBy,
    } = this.props;

    let tabIndex = 0;
    if (sortBy === 'createdAt') tabIndex = 1;

    const categoryLabel = getCategoryLabel(category);

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
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

          <FilterMenuButton />
        </Paper>
        <div
          className={classes.scrollContainer}
          ref={(container) => { this.scrollContainer = container; }}
        >
          <DialogAbout />
          <DialogSubmitApp />
          <DialogConfirmUninstallApp />
          <DialogAccount />
          <DialogFeedback />
          <Grid container className={classes.grid}>
            <Grid item xs={12}>
              <Grid container justify="center" gutter={24}>
                {apps.map(app => <AppCard key={app.id} app={app} />)}
              </Grid>
            </Grid>
          </Grid>
          {isGetting && (<LinearProgress />)}
        </div>
      </div>
    );
  }
}

Apps.defaultProps = {
  category: null,
  sortBy: null,
};

Apps.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  category: PropTypes.string,
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onGetApps: PropTypes.func.isRequired,
  onGetUser: PropTypes.func.isRequired,
  onGetUserApps: PropTypes.func.isRequired,
  onSetSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
};

const mapStateToProps = (state) => {
  const apps = state.ui.search.open ? state.ui.search.results : state.topCharts.apiData.apps;
  const isGetting = state.ui.search.open ? state.ui.search.isGetting : state.topCharts.isGetting;

  return {
    isGetting,
    apps,
    category: state.topCharts.queryParams.category,
    sortBy: state.topCharts.queryParams.sortBy,
  };
};

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
  onGetUserApps: () => dispatch(getUserApps()),
  onGetApps: optionsObject => dispatch(getApps(optionsObject)),
  onSetSortBy: (sortBy, sortOrder) => dispatch(setSortBy(sortBy, sortOrder)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Apps));
