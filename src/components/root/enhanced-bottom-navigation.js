import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import SettingsIcon from '@material-ui/icons/Settings';
import Badge from '@material-ui/core/Badge';

import connectComponent from '../../helpers/connect-component';

import { changeRoute } from '../../state/router/actions';
import { getOutdatedAppsAsList } from '../../state/app-management/utils';

import {
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
} from '../../constants/routes';

const styles = {
  paper: {
    zIndex: 1,
  },
};

const EnhancedBottomNavigation = ({
  classes, route, outdatedAppCount, onChangeRoute,
}) => (
  <Paper elevation={2} className={classes.paper}>
    <BottomNavigation
      value={route}
      onChange={(e, value) => onChangeRoute(value)}
      showLabels
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        value={ROUTE_HOME}
      />
      <BottomNavigationAction
        label="Installed"
        icon={outdatedAppCount > 0 ? (
          <Badge color="secondary" badgeContent={outdatedAppCount}>
            <SystemUpdateIcon />
          </Badge>
        ) : <SystemUpdateIcon />}
        value={ROUTE_INSTALLED}
      />
      <BottomNavigationAction
        label="Preferences"
        icon={<SettingsIcon />}
        value={ROUTE_PREFERENCES}
      />
    </BottomNavigation>
  </Paper>
);

EnhancedBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  outdatedAppCount: PropTypes.number.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  activated: state.general.activated,
  route: state.router.route,
  outdatedAppCount: getOutdatedAppsAsList(state).length,
});

const actionCreators = {
  changeRoute,
};

export default connectComponent(
  EnhancedBottomNavigation,
  mapStateToProps,
  actionCreators,
  styles,
);
