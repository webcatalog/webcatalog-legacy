import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppCard from '../shared/AppCard';
import DialogAccount from '../Dialogs/Account';
import DialogAbout from '../Dialogs/About';
import DialogSubmitApp from '../Dialogs/SubmitApp';
import DialogConfirmUninstallApp from '../Dialogs/ConfirmUninstallApp';
import DialogAppDetails from '../Dialogs/AppDetails';
import { getUser } from '../../state/user/actions';
import { getUserApps } from '../../state/user/apps/actions';
import { getAppDetails } from '../../state/apps/details/actions';
import { getApps } from '../../state/apps/actions';

const styleSheet = createStyleSheet('Apps', theme => ({
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

class Apps extends React.Component {
  componentDidMount() {
    const {
      onGetApps,
      onGetUserApps,
      onGetUser,
    } = this.props;

    onGetUser();
    onGetUserApps();
    onGetApps();

    const el = this.scrollContainer;

    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetApps({ next: true });
      }
    };
  }

  render() {
    const {
      isGetting,
      classes,
      apps,
    } = this.props;

    const dialogs = [
      <DialogAbout />,
      <DialogSubmitApp />,
      <DialogConfirmUninstallApp />,
      <DialogAppDetails />,
      <DialogAccount />,
    ];

    return (
      <div
        className={classes.scrollContainer}
        ref={(container) => { this.scrollContainer = container; }}
      >
        {dialogs}
        <Grid container>
          <Grid item xs={12}>
            <Grid container justify="center" gutter={24}>
              {apps.map(app => <AppCard app={app} />)}
            </Grid>
          </Grid>
        </Grid>
        {isGetting && (<div>loading</div>)}
      </div>
    );
  }
}

Apps.defaultProps = {
  category: null,
  sortBy: null,
};

Apps.propTypes = {
  classes: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetUserApps: PropTypes.func.isRequired,
  onGetApps: PropTypes.func.isRequired,
  onGetUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isGetting: state.apps.isGetting,
  apps: state.apps.apiData.apps,
  category: state.apps.queryParams.category,
  sortBy: state.apps.queryParams.sortBy,
});

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
  onGetUserApps: () => dispatch(getUserApps()),
  onGetApps: optionsObject => dispatch(getApps(optionsObject)),
  onGetAppDetails: id => dispatch(getAppDetails(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Apps));
