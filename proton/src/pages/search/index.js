import React from 'react';

import PropTypes from 'prop-types';
import SearchIcon from 'material-ui-icons/Search';

import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';

import connectComponent from '../../helpers/connect-component';

import { search } from '../../state/pages/search/actions';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';
import NoConnection from '../../shared/no-connection';

import {
  STRING_NO_RESULTS_HINT,
  STRING_NO_RESULTS,
} from '../../constants/strings';

const styles = () => ({
  scrollContainer: {
    flex: 1,
    padding: 36,
    overflow: 'auto',
    boxSizing: 'border-box',
  },
  grid: {
    marginBottom: 16,
  },
});

const Search = (props) => {
  const {
    apps,
    classes,
    hasFailed,
    isGetting,
    onSearch,
    query,
  } = props;

  if (query === '') return <EmptyState icon={SearchIcon} />;

  if (!isGetting && !hasFailed && apps.length < 1) {
    return (
      <EmptyState icon={SearchIcon} title={STRING_NO_RESULTS}>
        {STRING_NO_RESULTS_HINT}
      </EmptyState>
    );
  }

  return (
    <div
      className={classes.scrollContainer}
      ref={(container) => { this.scrollContainer = container; }}
    >
      {hasFailed ? (
        <NoConnection
          onTryAgainButtonClick={onSearch}
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
  );
};

Search.defaultProps = {
  query: '',
};

Search.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired,
  query: '',
};

const mapStateToProps = state => ({
  apps: state.pages.search.apps,
  hasFailed: state.pages.search.hasFailed,
  isGetting: state.pages.search.isGetting,
  query: state.pages.search.form.query,
});

const actionCreators = {
  search,
};

export default connectComponent(
  Search,
  mapStateToProps,
  actionCreators,
  styles,
);
