import React from 'react';

import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import connectComponent from '../../../helpers/connect-component';

import { getAvailableUpdateCount } from '../../../state/root/local/utils';
import { changeRoute } from '../../../state/root/router/actions';

import {
  STRING_UPDATES_AVAILABLE,
  STRING_VIEW,
} from '../../../constants/strings';

import { ROUTE_INSTALLED_APPS } from '../../../constants/routes';

import AppCard from '../../shared/app-card';

import SearchBox from './search-box';

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

class Directory extends React.Component {
  render() {
    const {
      apps,
      availableUpdateCount,
      classes,
      onChangeRoute,
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
              <Grid container justify="center" spacing={24}>
                {apps.map(app => <AppCard key={app.id} app={app} />)}
              </Grid>
            </Grid>
          </Grid>
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
  onChangeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  apps: state.pages.directory.hits,
  availableUpdateCount: getAvailableUpdateCount(state),
});

const actionCreators = {
  changeRoute,
};

export default connectComponent(
  Directory,
  mapStateToProps,
  actionCreators,
  styles,
);
