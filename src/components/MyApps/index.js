import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppsIcon from 'material-ui-icons/Apps';
import AppCard from '../shared/AppCard';
import DialogAccount from '../dialogs/Account';
import DialogAbout from '../dialogs/About';
import DialogSubmitApp from '../dialogs/SubmitApp';
import DialogConfirmUninstallApp from '../dialogs/ConfirmUninstallApp';
import DialogFeedback from '../dialogs/Feedback';
import { getUser } from '../../state/user/actions';
import { getUserApps } from '../../state/user/apps/actions';
import EmptyState from './EmptyState';

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
      onGetUser,
    } = props;

    onGetUser();
    onGetUserApps();
  }

  render() {
    const {
      isGetting,
      classes,
      userApps,
    } = this.props;

    const dialogs = [
      <DialogAbout />,
      <DialogSubmitApp />,
      <DialogConfirmUninstallApp />,
      <DialogAccount />,
      <DialogFeedback />,
    ];

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
        <div>
          {dialogs}
          <Grid container>
            <Grid item xs={12}>
              <Grid container justify="center" gutter={24}>
                {userApps.map(app => <AppCard app={app} />)}
              </Grid>
            </Grid>
          </Grid>
        </div>
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

MyApps.defaultProps = {
  category: null,
  sortBy: null,
};

MyApps.propTypes = {
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  userApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetUserApps: PropTypes.func.isRequired,
  onGetUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userApps: state.user.apps.apiData.apps,
  isGetting: state.user.apps.isGetting,
  category: state.apps.queryParams.category,
  sortBy: state.apps.queryParams.sortBy,
});

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
  onGetUserApps: () => dispatch(getUserApps()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(MyApps));
