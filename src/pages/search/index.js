import React from 'react';

import PropTypes from 'prop-types';
import SearchIcon from 'material-ui-icons/Search';

import { LinearProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import LocalOfferIcon from 'material-ui-icons/LocalOffer';

import connectComponent from '../../helpers/connect-component';

import AppCard from '../../shared/app-card';
import EmptyState from '../../shared/empty-state';

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
    isGetting,
    query,
  } = props;

  if (!isGetting && !apps.length) {
    if (query === '') return <EmptyState icon={SearchIcon} title="Search hundreds of apps" />;
  }

  return (
    <div
      className={classes.scrollContainer}
      ref={(container) => { this.scrollContainer = container; }}
    >
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={24}>
            {apps.map(app => <AppCard key={app.id} app={app} />)}
          </Grid>
        </Grid>
      </Grid>
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
  isGetting: PropTypes.bool.isRequired,
  query: '',
};

const mapStateToProps = state => ({
  apps: state.pages.search.apps,
  isGetting: state.pages.search.isGetting,
  query: state.pages.search.form.query,
});

export default connectComponent(
  Search,
  mapStateToProps,
  null,
  styles,
);
