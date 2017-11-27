import React from 'react';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import HelpIcon from 'material-ui-icons/Help';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import connectComponent from '../helpers/connect-component';

import FakeTitleBar from '../shared/fake-title-bar';

import { open as openDialogAbout } from '../actions/dialogs/about/actions';
import {
  changeRoute,
} from '../actions/root/router/actions';

import {
  ROUTE_INSTALLED_APPS,
  ROUTE_POPULAR_APPS,
} from '../constants/routes';

import {
  STRING_INSTALLED_APPS,
  STRING_POPULAR_APPS,
} from '../constants/strings';

import { requestCheckForUpdates } from '../senders/updater';
import { requestScanInstalledApps } from '../senders/local';
import { requestOpenInBrowser } from '../senders/generic';

const styles = () => ({
  root: {
    zIndex: 1,
  },
  toolbar: {
    padding: '0 12px',
  },
  title: {
    padding: '0 16px',
    flex: 1,
    userSelect: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  appBar: {
    zIndex: 1,
  },
  tabRoot: {
    flexGrow: 1,
  },
});

class EnhancedAppBar extends React.Component {
  constructor() {
    super();

    this.state = {
      isDrawerOpen: false,
    };

    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
  }

  componentDidMount() {
    // start checking for installed apps only when the app is loaded.
    requestScanInstalledApps();
    requestCheckForUpdates();
  }

  handleToggleDrawer() {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  }

  render() {
    const {
      classes,
      onChangeRoute,
      onOpenDialogAbout,
      route,
    } = this.props;

    return (
      <div className={classes.root}>
        <FakeTitleBar />
        <AppBar position="static" key="appBar" className={classes.appBar} elevation={0}>
          <Toolbar className={classes.toolbar}>
            <Typography
              className={classes.title}
              color="inherit"
              type="title"
            >
              WebCatalog
            </Typography>
            <Button color="contrast">Create An App</Button>
            <IconButton
              aria-owns="info"
              aria-haspopup="true"
              onClick={() => requestOpenInBrowser('https://webcatalog.io/help')}
              color="contrast"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              aria-owns="info"
              aria-haspopup="true"
              onClick={onOpenDialogAbout}
              color="contrast"
            >
              <InfoIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Paper className={classes.tabRoot}>
          <Tabs
            value={route}
            onChange={(e, val) => onChangeRoute(val)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              value={ROUTE_POPULAR_APPS}
              label={STRING_POPULAR_APPS}
            />
            <Tab
              value={ROUTE_INSTALLED_APPS}
              label={STRING_INSTALLED_APPS}
            />
          </Tabs>
        </Paper>
      </div>
    );
  }
}

EnhancedAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
  onOpenDialogAbout: PropTypes.func.isRequired,
  route: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  route: state.router.route,
});

const actionCreators = {
  changeRoute,
  openDialogAbout,
};

export default connectComponent(
  EnhancedAppBar,
  mapStateToProps,
  actionCreators,
  styles,
);
