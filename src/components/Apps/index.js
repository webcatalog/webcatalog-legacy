import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import grey from 'material-ui/colors/grey';
import { withStyles, createStyleSheet } from 'material-ui/styles';

import AppCard from '../Shared/AppCard';
import DialogAccount from '../Dialogs/Account';
import DialogAbout from '../Dialogs/About';
import DialogSubmitApp from '../Dialogs/SubmitApp';
import DialogConfirmUninstallApp from '../Dialogs/ConfirmUninstallApp';
import DialogAppDetails from '../Dialogs/AppDetails';
import {
  getUser,
  postUser,
  patchUser,
} from '../../state/user/actions';
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
    const { onGetApps } = this.props;
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
      classes,
      apps,
      onGetUser,
      onPostUser,
      onPatchUser,
      onGetApps,
    } = this.props;

    const dialogs = [
      <DialogAbout />,
      <DialogSubmitApp />,
      <DialogConfirmUninstallApp />,
      <DialogAppDetails />,
      <DialogAccount />,
    ];

    return (
      <div>
        <div onClick={onGetUser}>GET</div>
        <div onClick={onPostUser}>POST</div>
        <div onClick={onPatchUser}>PATCH</div>
        <div onClick={onGetApps}>GET APPS</div>
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
        </div>
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
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  onGetUser: PropTypes.func.isRequired,
  onPostUser: PropTypes.func.isRequired,
  onPatchUser: PropTypes.func.isRequired,
  onGetApps: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  console.log('state:', state.apps);
  return {
    apps: state.apps.apiData.apps,
    category: state.apps.queryParams.category,
    sortBy: state.apps.queryParams.sortBy,
  };
};

const mapDispatchToProps = dispatch => ({
  onGetUser: () => dispatch(getUser()),
  onPostUser: () => dispatch(postUser()),
  onPatchUser: () => dispatch(patchUser()),
  onGetApps: optionsObject => dispatch(getApps(optionsObject)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Apps));
