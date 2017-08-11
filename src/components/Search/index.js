import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { LinearProgress } from 'material-ui/Progress';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import AppCard from '../shared/AppCard';

const styleSheet = createStyleSheet('Search', () => ({
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

const Search = (props) => {
  const {
    apps,
    classes,
    isGetting,
  } = props;

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

Search.propTypes = {
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isGetting: state.search.isGetting,
  apps: state.search.results,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Search));
