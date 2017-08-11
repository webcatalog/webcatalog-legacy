import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppsIcon from 'material-ui-icons/Apps';
import AppCard from '../shared/AppCard';
import { getUserApps } from '../../state/myApps/actions';
import EmptyState from '../shared/EmptyState';

const styleSheet = createStyleSheet('MyApps', theme => ({
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
}));

class MyApps extends React.Component {
  constructor(props) {
    super(props);

    const {
      onGetUserApps,
    } = props;

    onGetUserApps();
  }

  render() {
    const {
      isGetting,
      classes,
      userApps,
    } = this.props;

    let element;
    if (isGetting) element = <div>loading</div>;
    if (!userApps.length) {
      element = (
        <EmptyState Icon={AppsIcon}>
          No installed apps
        </EmptyState>
      );
    } else {
      element = (
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={24}>
              {userApps.map(app => <AppCard app={app} />)}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return (
      <div
        className={classes.scrollContainer}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {element}
      </div>
    );
  }
}

MyApps.propTypes = {
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  userApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetUserApps: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userApps: state.myApps.apiData.apps,
  isGetting: state.myApps.isGetting,
});

const mapDispatchToProps = dispatch => ({
  onGetUserApps: () => dispatch(getUserApps()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(MyApps));
