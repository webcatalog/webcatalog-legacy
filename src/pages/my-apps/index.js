import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { LinearProgress } from 'material-ui/Progress';
import LocalOfferIcon from 'material-ui-icons/LocalOffer';

import connectComponent from '../../utils/connect-component';

import AppCard from '../../shared/app-card';
import {
  getMyApps,
  resetAndGetMyApps,
} from '../../state/pages/my-apps/actions';
import EmptyState from '../../shared/empty-state';
import RequireLogIn from '../../shared/require-log-in';

import {
  STRING_NO_APPS,
  STRING_NO_APPS_DESC,
} from '../../constants/strings';

const styleSheet = theme => ({
  scrollContainer: {
    flex: 1,
    padding: 36,
    overflow: 'auto',
    boxSizing: 'border-box',
  },

  card: {
    width: 200,
    boxSizing: 'border-box',
  },

  appName: {
    marginTop: 16,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  paperIcon: {
    width: 60,
    height: 'auto',
  },

  titleText: {
    fontWeight: 500,
    lineHeight: 1.5,
    marginTop: theme.spacing.unit,
  },
  cardContent: {
    position: 'relative',
    backgroundColor: grey[100],
    // height: 100,
    // flex
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  domainText: {
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: theme.spacing.unit,
  },
  cardActions: {
    justifyContent: 'center',
  },

  rightButton: {
    marginLeft: theme.spacing.unit,
  },
  iconButton: {
    margin: 0,
  },

  moreIconMenu: {
    position: 'absolute',
    transform: 'translate(58px, -16px)',
  },
  hiddenMenuItem: {
    display: 'none',
  },
  grid: {
    marginBottom: 16,
  },
});

class MyApps extends React.Component {
  componentDidMount() {
    const {
      isLoggedIn,
      onGetMyApps,
      onResetAndGetMyApps,
    } = this.props;

    if (isLoggedIn) {
      onResetAndGetMyApps();
    }

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetMyApps();
      }
    };
  }

  renderContent() {
    const {
      isGetting,
      isLoggedIn,
      classes,
      apps,
    } = this.props;

    if (!isLoggedIn) {
      return <RequireLogIn />;
    }

    if (!isGetting && !apps.length) {
      return (
        <EmptyState icon={LocalOfferIcon} title={STRING_NO_APPS}>
          {STRING_NO_APPS_DESC}
        </EmptyState>
      );
    }

    return (
      <Grid container className={classes.grid}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={24}>
            {apps.map(app => <AppCard app={app} />)}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  render() {
    const {
      isGetting,
      isLoggedIn,
      classes,
    } = this.props;

    return (
      <div
        className={classes.scrollContainer}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {this.renderContent()}
        {isLoggedIn && isGetting && (<LinearProgress />)}
      </div>
    );
  }
}

MyApps.propTypes = {
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetMyApps: PropTypes.func.isRequired,
  onResetAndGetMyApps: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  apps: state.pages.myApps.apiData.apps,
  hasFailed: state.pages.myApps.hasFailed,
  isGetting: state.pages.myApps.isGetting,
  isLoggedIn: Boolean(state.auth.token && state.auth.token !== 'anonymous'),
});

const actionCreators = {
  getMyApps,
  resetAndGetMyApps,
};

export default connectComponent(
  MyApps,
  mapStateToProps,
  actionCreators,
  styleSheet,
);
