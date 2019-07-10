import React from 'react';

// External Dependencies
import common from 'material-ui/colors/common';
import List from 'material-ui/List';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { LinearProgress } from 'material-ui/Progress';

// Internal Dependencies
import AppRow from '../../shared/app-row';
import categories from '../../constants/categories';
import connectComponent from '../../helpers/connect-component';
import NoConnection from '../../shared/no-connection';
import {
  getApps,
  resetAndGetApps,
  setCategory,
  setSortBy,
} from '../../state/pages/top-charts/actions';
import {
  STRING_NEW_APPS,
  STRING_TOP_APPS,
} from '../../constants/strings';

// Local Variables
const { lightBlack } = common;

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    overflowY: 'scroll',
  },
  spacerContainer: {
    display: 'flex',
    width: '10%',
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 36,
    width: '20%',
  },
  appsList: {
    padding: 0,
  },
  appsContainer: {
    marginBottom: 36,
    width: '100%',
  },
  tab: {
    width: 225,
  },
  paper: {
    display: 'flex',
    paddingLeft: 12,
    paddingRight: 12,
    zIndex: 1,
  },
  tabs: {
    boxSizing: 'border-box',
    flex: 1,
  },
  buttonContainer: {
    flex: '0 0 48px',
  },
  scrollContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    padding: 36,
    width: '60%',
  },
  grid: {
    marginBottom: 16,
  },
  category: {
    cursor: 'pointer',
    fontSize: 13,
    lineHeight: 1,
    marginBottom: 14,
    '&:hover': {
      color: lightBlack,
    },
  },
  categoryActive: {
    extend: 'category',
    color: theme.palette.primary[700],
    fontWeight: 600,
  },
  categorySeparator: {
    margin: '24px 0px',
  },
});

class TopCharts extends React.Component {
  componentDidMount() {
    const {
      onGetApps,
      onResetAndGetApps,
    } = this.props;

    onResetAndGetApps();

    const rootContainerElement = this.rootContainer;

    rootContainerElement.onscroll = () => {
      // Plus 300 to run ahead.
      if (rootContainerElement.scrollTop + 300 >=
        rootContainerElement.scrollHeight - rootContainerElement.offsetHeight) {
        onGetApps();
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
      onSetCategory,
      onSetSortBy,
      sortBy,
    } = this.props;

    // Functions
    const handleClickSortCategory = () => {
      if (sortBy !== 'installCount') return onSetSortBy('installCount', 'desc');
      return onSetSortBy('createdAt', 'desc');
    };

    // Elements
    const noConnectionElement = hasFailed
      ? <NoConnection onTryAgainButtonClick={onGetApps} />
      : null;

    const appsListElement = hasFailed
      ? null
      : (
        <List className={classes.appsList}>
          <Paper className={classes.appsContainer}>
            {apps.map(app => <AppRow key={app.id} app={app} />)}
          </Paper>
        </List>
      );

    const progressElement = isGetting
      ? <LinearProgress />
      : null;

    const categoryItemElements = categories.map(c => (
      <div
        className={classes[`category${category === c.value ? 'Active' : ''}`]}
        onClick={() => onSetCategory(c.value)}
        role="button"
        tabIndex="0"
      >
        {c.label}
      </div>
    ));

    return (
      <div
        className={classes.root}
        ref={(container) => { this.rootContainer = container; }}
      >
        <div className={classes.spacerContainer} />
        <div className={classes.filtersContainer}>
          <div
            className={classes[`category${sortBy === 'installCount' ? 'Active' : ''}`]}
            onClick={handleClickSortCategory}
            role="button"
            tabIndex="0"
          >
            {STRING_TOP_APPS}
          </div>
          <div
            className={classes[`category${sortBy === 'createdAt' ? 'Active' : ''}`]}
            onClick={handleClickSortCategory}
            role="button"
            tabIndex="0"
          >
            {STRING_NEW_APPS}
          </div>
          <hr className={classes.categorySeparator} />
          {categoryItemElements}
        </div>
        <div
          className={classes.scrollContainer}
        >
          {noConnectionElement}
          {appsListElement}
          {progressElement}
        </div>
        <div className={classes.spacerContainer} />
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
  onResetAndGetApps: PropTypes.func.isRequired,
  onSetCategory: PropTypes.func.isRequired,
  onSetSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
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
    category,
    hasFailed,
    isGetting,
    sortBy,
  };
};

const actionCreators = {
  resetAndGetApps,
  getApps,
  setSortBy,
  setCategory,
};

export default connectComponent(
  TopCharts,
  mapStateToProps,
  actionCreators,
  styles,
);
