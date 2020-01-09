import React from 'react';

import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';

import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders';

import { getHits } from '../../../state/home/actions';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';
import EmptyState from '../../shared/empty-state';
import CreateCustomAppCard from './create-custom-app-card';
import SubmitAppCard from './submit-app-card';

import SearchBox from './search-box';

import searchByAlgoliaLightSvg from '../../../assets/search-by-algolia-light.svg';
import searchByAlgoliaDarkSvg from '../../../assets/search-by-algolia-dark.svg';


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
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  grid: {
    marginBottom: theme.spacing.unit,
  },
  searchByAlgoliaContainer: {
    marginTop: theme.spacing.unit * 3,
    outline: 'none',
  },
  searchByAlgolia: {
    height: 20,
    cursor: 'pointer',
  },
  noMatchingResultOpts: {
    marginTop: theme.spacing.unit * 4,
  },
});

class Home extends React.Component {
  componentDidMount() {
    const { onGetHits } = this.props;

    onGetHits();

    const el = this.scrollContainer;
    el.onscroll = () => {
      // Plus 300 to run ahead.
      const { isGetting, currentQuery, hits } = this.props;
      if (!isGetting && currentQuery.length > 0 && hits.length < 1) return; // no result
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetHits();
      }
    };
  }

  render() {
    const {
      classes,
      currentQuery,
      hasFailed,
      hits,
      isGetting,
      onGetHits,
      shouldUseDarkColors,
    } = this.props;

    const renderContent = () => {
      if (hasFailed) {
        return (
          <NoConnection
            onTryAgainButtonClick={onGetHits}
          />
        );
      }

      if (!isGetting && currentQuery.length > 0 && hits.length < 1) {
        return (
          <EmptyState icon={SearchIcon} title="No Matching Results">
            <Typography
              variant="subtitle1"
              align="center"
            >
              Your search -&nbsp;
              <b>{currentQuery}</b>
              &nbsp;- did not match any apps in the catalog.
            </Typography>
            <Grid container justify="center" spacing={16} className={classes.noMatchingResultOpts}>
              <CreateCustomAppCard />
              <SubmitAppCard />
            </Grid>
          </EmptyState>
        );
      }

      return (
        <>
          <Grid container justify="center" spacing={16}>
            {currentQuery && (
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  align="left"
                >
                  Search results for&nbsp;
                  <b>{currentQuery}</b>
                </Typography>
                <Divider className={classes.divider} />
              </Grid>
            )}
            {!isGetting && <CreateCustomAppCard key="create-custom-app" />}
            {hits.map((app) => (
              <AppCard
                key={app.id}
                id={app.id}
                name={app.name}
                url={app.url}
                icon={app.icon}
                icon128={app.icon128}
              />
            ))}
            {!isGetting && <SubmitAppCard key="submit-new-app" />}
          </Grid>

          {!isGetting && (
            <Grid container justify="center" spacing={16}>
              <div
                onKeyDown={() => requestOpenInBrowser('https://algolia.com')}
                onClick={() => requestOpenInBrowser('https://algolia.com')}
                role="link"
                tabIndex="0"
                className={classes.searchByAlgoliaContainer}
              >
                <img
                  src={shouldUseDarkColors ? searchByAlgoliaDarkSvg : searchByAlgoliaLightSvg}
                  alt="Search by Algolia"
                  className={classes.searchByAlgolia}
                />
              </div>
            </Grid>
          )}
        </>
      );
    };

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <SearchBox />
          </Grid>
        </Grid>
        <div
          className={classes.scrollContainer}
          ref={(container) => { this.scrollContainer = container; }}
        >
          <Grid container className={classes.grid} spacing={16}>
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

Home.defaultProps = {
  currentQuery: '',
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  currentQuery: PropTypes.string,
  hasFailed: PropTypes.bool.isRequired,
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGetting: PropTypes.bool.isRequired,
  onGetHits: PropTypes.func.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  currentQuery: state.home.currentQuery,
  hasFailed: state.home.hasFailed,
  hits: state.home.hits,
  isGetting: state.home.isGetting,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
});

const actionCreators = {
  getHits,
};

export default connectComponent(
  Home,
  mapStateToProps,
  actionCreators,
  styles,
);
