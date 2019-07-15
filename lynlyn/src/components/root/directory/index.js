import React from 'react';

import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SettingsIcon from '@material-ui/icons/Settings';


import connectComponent from '../../../helpers/connect-component';

import { requestOpenInBrowser } from '../../../senders/generic';

import { getHits } from '../../../state/root/directory/actions';
import { open as openDialogActivate } from '../../../state/dialogs/activate/actions';
import { open as openDialogAbout } from '../../../state/dialogs/about/actions';
import { open as openDialogAddWorkspace } from '../../../state/dialogs/add-workspace/actions';
import { open as openDialogPreferences } from '../../../state/dialogs/preferences/actions';

import {
  STRING_ABOUT,
  STRING_ACTIVATE,
  STRING_ADD_CUSTOM_WORKSPACE,
  STRING_ADD_WORKSPACE,
  STRING_CONTACT,
  STRING_NO_RESULTS,
  STRING_NO_RESULTS_HINT,
  STRING_PREFERENCES,
  STRING_PURCHASE,
} from '../../../constants/strings';

import AppCard from '../../shared/app-card';
import NoConnection from '../../shared/no-connection';
import EmptyState from '../../shared/empty-state';
import EnhancedMenu from '../../shared/enhanced-menu';

import SearchBox from './search-box';

import searchByAlgoliaSvg from '../../../assets/search-by-algolia.svg';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  paper: {
    zIndex: 1,
    display: 'flex',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
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
  searchByAlgoliaContainer: {
    marginTop: theme.spacing.unit * 3,
    outline: 'none',
  },
  searchByAlgolia: {
    height: 20,
    cursor: 'pointer',
  },
  donateMessageContainer: {
    textAlign: 'center',
    width: '100%',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
  },
  donateMessageButton: {
    marginLeft: theme.spacing.unit,
  },
  flex: {
    flex: 1,
  },
});

class Directory extends React.Component {
  componentDidMount() {
    const { onGetHits } = this.props;

    onGetHits();

    const el = this.scrollContainer;
    el.onscroll = () => {
      // Plus 300 to run ahead.
      if (el.scrollTop + 300 >= el.scrollHeight - el.offsetHeight) {
        onGetHits();
      }
    };
  }

  render() {
    const {
      activated,
      apps,
      classes,
      hasFailed,
      isGetting,
      onGetHits,
      onOpenDialogAbout,
      onOpenDialogActivate,
      onOpenDialogAddWorkspace,
      onOpenDialogPreferences,
    } = this.props;

    const renderContent = () => {
      if (hasFailed) {
        return (
          <NoConnection
            onTryAgainButtonClick={onGetHits}
          />
        );
      }

      if (!isGetting && apps.length < 1) {
        return (
          <EmptyState icon={SearchIcon} title={STRING_NO_RESULTS}>
            {STRING_NO_RESULTS_HINT}
          </EmptyState>
        );
      }

      return (
        <React.Fragment>
          <Grid container justify="center" spacing={24}>
            {apps.map(app => <AppCard key={app.id} app={app} />)}
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
                  src={searchByAlgoliaSvg}
                  alt="Search by Algolia"
                  className={classes.searchByAlgolia}
                />
              </div>
            </Grid>
          )}
        </React.Fragment>
      );
    };

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar} elevation={3}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="title" color="inherit" className={classes.flex}>
              {STRING_ADD_WORKSPACE}
            </Typography>
            <Button color="inherit" onClick={onOpenDialogAddWorkspace}>
              <AddIcon className={classes.leftIcon} />
              {STRING_ADD_CUSTOM_WORKSPACE}
            </Button>
            <EnhancedMenu
              id="more"
              buttonElement={(
                <IconButton color="inherit">
                  <MoreVertIcon />
                </IconButton>
              )}
            >
              {!activated && (
                <ListItem button onClick={onOpenDialogActivate}>
                  <ListItemIcon>
                    <LockOpenIcon />
                  </ListItemIcon>
                  <ListItemText primary={STRING_ACTIVATE} />
                </ListItem>
              )}
              <ListItem button onClick={onOpenDialogPreferences}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_PREFERENCES} />
              </ListItem>
              <ListItem button onClick={() => requestOpenInBrowser('mailto:quang.lam2807@gmail.com?subject=[WebCatalog]')}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_CONTACT} />
              </ListItem>
              <ListItem button onClick={onOpenDialogAbout}>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary={STRING_ABOUT} />
              </ListItem>
            </EnhancedMenu>
          </Toolbar>
        </AppBar>
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
            {!activated && (
              <div className={classes.donateMessageContainer}>
                <Button
                  color="primary"
                  variant="raised"
                  onClick={() => requestOpenInBrowser('https://getwebcatalog.com/purchase')}
                >
                  {STRING_PURCHASE}
                </Button>
                <Button
                  color="secondary"
                  variant="raised"
                  onClick={onOpenDialogActivate}
                  className={classes.donateMessageButton}
                >
                  {STRING_ACTIVATE}
                </Button>
              </div>
            )}
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


Directory.propTypes = {
  activated: PropTypes.bool.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
  classes: PropTypes.object.isRequired,
  hasFailed: PropTypes.bool.isRequired,
  isGetting: PropTypes.bool.isRequired,
  onGetHits: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  onOpenDialogActivate: PropTypes.func.isRequired,
  onOpenDialogAddWorkspace: PropTypes.func.isRequired,
  onOpenDialogPreferences: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activated: state.general.activated,
  apps: state.directory.hits,
  hasFailed: state.directory.hasFailed,
  isGetting: state.directory.isGetting,
});

const actionCreators = {
  getHits,
  openDialogAbout,
  openDialogActivate,
  openDialogAddWorkspace,
  openDialogPreferences,
};

export default connectComponent(
  Directory,
  mapStateToProps,
  actionCreators,
  styles,
);
