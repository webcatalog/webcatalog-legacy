/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import AppsIcon from '@material-ui/icons/Apps';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import SettingsIcon from '@material-ui/icons/Settings';

import SpaceIcon from '../../shared/space-icon';

import connectComponent from '../../../helpers/connect-component';

import { changeRoute } from '../../../state/router/actions';
import { getAppBadgeCount } from '../../../state/app-management/utils';

import {
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
  ROUTE_SPACES,
} from '../../../constants/routes';

import ListItemAccount from './list-item-account';

const styles = (theme) => ({
  sidebar: {
    width: 80,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[800],
    color: theme.palette.common.white,
    height: '100%',
    overflow: 'auto',
    paddingTop: 0,
  },
  sidebarInner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  sidebarListTop: {
    flex: 1,
    paddingTop: 0,
  },
  sidebarTop: {
    height: 40,
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  listItemSelected: {
    backgroundColor: `${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.grey[900]} !important`,
  },
  listItemIcon: {
    color: theme.palette.common.white,
    margin: '0 auto',
    minWidth: 'auto',
  },
  listItemTextPrimary: theme.typography.body2,
});

const Home = ({
  appBadgeCount,
  classes,
  route,
  onChangeRoute,
}) => {
  const showTooltip = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const mainSections = {
    all: {
      text: 'Catalog',
      Icon: AppsIcon,
    },
    spaces: {
      text: 'Spaces',
      Icon: SpaceIcon,
    },
    updates: {
      text: 'Installed',
      Icon: OfflinePinIcon,
    },
    preferences: {
      text: 'Settings',
      Icon: SettingsIcon,
    },
  };

  return (
    <Grid item className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <div className={classes.sidebarTop} />
        <List className={classes.sidebarListTop}>
          {Object.keys(mainSections).map((sectionKey) => {
            const {
              Icon, text, hidden,
            } = mainSections[sectionKey];
            if (hidden) return null;

            const selected = (() => {
              if (sectionKey === 'updates') {
                return route === ROUTE_INSTALLED;
              }

              if (sectionKey === 'preferences') {
                return route === ROUTE_PREFERENCES;
              }

              if (sectionKey === 'all') {
                return route === ROUTE_HOME;
              }

              if (sectionKey === 'spaces') {
                return route === ROUTE_SPACES;
              }

              return false;
            })();

            const listItem = (
              <ListItem
                button
                key={sectionKey}
                onClick={() => {
                  if (sectionKey === 'all') {
                    onChangeRoute(ROUTE_HOME);
                  } else if (sectionKey === 'updates') {
                    onChangeRoute(ROUTE_INSTALLED);
                  } else if (sectionKey === 'preferences') {
                    onChangeRoute(ROUTE_PREFERENCES);
                  } else if (sectionKey === 'spaces') {
                    onChangeRoute(ROUTE_SPACES);
                  }
                }}
                title={text}
                selected={selected}
                classes={{
                  root: classes.listItem,
                  selected: classes.listItemSelected,
                }}
              >
                <ListItemIcon classes={{ root: classes.listItemIcon }}>
                  {sectionKey === 'updates' ? (
                    <Badge color="secondary" badgeContent={appBadgeCount}>
                      <Icon fontSize="medium" />
                    </Badge>
                  ) : (
                    <Icon fontSize="medium" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  classes={{
                    primary: classes.listItemTextPrimary,
                  }}
                />
              </ListItem>
            );

            if (showTooltip) {
              return (
                <Tooltip key={text} title={text} placement="right" arrow>
                  {listItem}
                </Tooltip>
              );
            }

            return listItem;
          })}
        </List>
        <ListItemAccount />
      </div>
    </Grid>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  appBadgeCount: PropTypes.number.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  route: state.router.route,
  appBadgeCount: getAppBadgeCount(state),
});

const actionCreators = {
  changeRoute,
};

export default connectComponent(
  Home,
  mapStateToProps,
  actionCreators,
  styles,
);
