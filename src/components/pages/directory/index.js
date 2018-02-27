import React from 'react';

import PropTypes from 'prop-types';

import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import SearchIcon from 'material-ui-icons/Search';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders/generic';

import { getAvailableUpdateCount } from '../../../state/root/local/utils';
import { changeRoute } from '../../../state/root/router/actions';
import { getHits } from '../../../state/pages/directory/actions';

import {
  STRING_UPDATES_AVAILABLE,
  STRING_VIEW,
  STRING_NO_RESULTS_HINT,
  STRING_NO_RESULTS,
} from '../../../constants/strings';

import { ROUTE_INSTALLED_APPS } from '../../../constants/routes';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';
import EmptyState from '../../shared/empty-state';

import SearchBox from './search-box';

import searchByAlgoliaSvg from '../../../assets/search-by-algolia.svg';

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
  searchByAlgoliaContainer: {
    marginTop: theme.spacing.unit * 3,
    outline: 'none',
  },
  searchByAlgolia: {
    height: 20,
    cursor: 'pointer',
  },
});

class Directory extends React.Component {
  componentDidMount() {
    const { onGetHits } = this.props;

    onGetHits();

    const el = this.scrollContainer;
    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetHits();
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
      onGetHits,
    } = this.props;

    const renderContent = () => {
      if (hasFailed) {
        return (
          <NoConnection
            onTryAgainButtonClick={onGetHits}
          />
        );
      }

      if (!isGetting && apps.length < 1) {
        return (
          <EmptyState icon={SearchIcon} title={STRING_NO_RESULTS}>
            {STRING_NO_RESULTS_HINT}
          </EmptyState>
        );
      }

      return (
        <React.Fragment>
          <Grid container justify="center" spacing={24}>
            {apps.map(app => <AppCard key={app.id} app={app} />)}
          </Grid>

          {!isGetting && (
            <Grid container justify="center">
              <div onClick={() => requestOpenInBrowser('https://algolia.com')} role="link" tabIndex="0" className={classes.searchByAlgoliaContainer}>
                <img
                  src={searchByAlgoliaSvg}
                  alt="Search by Algolia"
                  className={classes.searchByAlgolia}
                />
              </div>
            </Grid>
          )}
        </React.Fragment>
      );
    };

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.buttonContainer} />
        </Paper>
        <div
          className={classes.scrollContainer}
          ref={(container) => { this.scrollContainer = container; }}
        >
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
                </div>
              )}
              <SearchBox />
            </Grid>
            <Grid item xs={12}>
              {renderContent()}
            </Grid>
          </Grid>
          {isGetting && (<LinearProgress />)}
        </div>
      </div>
    );
  }
}

Directory.defaultProps = {
  availableUpdateCount: 0,
};

Directory.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  availableUpdateCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onGetHits: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  apps: state.pages.directory.hits,
  availableUpdateCount: getAvailableUpdateCount(state),
  hasFailed: state.pages.directory.hasFailed,
  isGetting: state.pages.directory.isGetting,
});

const actionCreators = {
  changeRoute,
  getHits,
};

export default connectComponent(
  Directory,
  mapStateToProps,
  actionCreators,
  styles,
);
