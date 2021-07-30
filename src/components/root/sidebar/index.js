/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import {
  WithSearch,
} from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import StarsIcon from '@material-ui/icons/Stars';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import CategoryIcon from '@material-ui/icons/Category';
import SettingsIcon from '@material-ui/icons/Settings';

import connectComponent from '../../../helpers/connect-component';

import { changeRoute } from '../../../state/router/actions';
import { getAppBadgeCount } from '../../../state/app-management/utils';

import {
  ROUTE_CATEGORIES,
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
} from '../../../constants/routes';

import ListItemAccount from './list-item-account';

const styles = (theme) => ({
  sidebar: {
    width: 220,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[800],
    color: theme.palette.common.white,
    height: '100%',
    overflow: 'auto',
    paddingTop: 0,
    [theme.breakpoints.down('sm')]: {
      width: 80,
    },
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
  listItemSelected: {
    backgroundColor: `${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.grey[900]} !important`,
  },
  sidebarTop: {
    height: 40,
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  listItemIcon: {
    color: theme.palette.common.white,
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      minWidth: 0,
    },
  },
  listItemText: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
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
      text: 'Discover',
      Icon: StarsIcon,
    },
    spaces: {
      text: 'Spaces',
      Icon: GroupWorkIcon,
    },
    categories: {
      text: 'Categories',
      Icon: CategoryIcon,
    },
    updates: {
      text: 'Updates',
      Icon: SystemUpdateAltIcon,
    },
    preferences: {
      text: 'Preferences',
      Icon: SettingsIcon,
    },
  };

  return (
    <Grid item className={classes.sidebar}>
      <div className={classes.sidebarInner}>
        <div className={classes.sidebarTop} />
        <WithSearch
          mapContextToProps={({
            filters,
            clearFilters,
            setFilter,
          }) => ({
            filters,
            clearFilters,
            setFilter,
          })}
        >
          {({
            filters,
            clearFilters,
            setFilter,
          }) => {
            const typeFilter = filters.find((filter) => filter.field === 'type');
            const categoryFilter = filters.find((filter) => filter.field === 'category');

            return (
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
                      return route === ROUTE_HOME
                        && categoryFilter == null && typeFilter == null;
                    }

                    if (sectionKey === 'spaces') {
                      return route === ROUTE_HOME
                        && typeFilter && typeFilter.values[0] === 'Multisite';
                    }

                    if (sectionKey === 'categories') {
                      return route === ROUTE_CATEGORIES
                        || (route === ROUTE_HOME && categoryFilter != null);
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
                          clearFilters();
                        } else if (sectionKey === 'categories') {
                          onChangeRoute(ROUTE_CATEGORIES);
                        } else if (sectionKey === 'updates') {
                          onChangeRoute(ROUTE_INSTALLED);
                        } else if (sectionKey === 'preferences') {
                          onChangeRoute(ROUTE_PREFERENCES);
                        } else if (sectionKey === 'spaces') {
                          clearFilters('type'); // clear all filters except type filter
                          setFilter('type', 'Multisite', 'all');
                          onChangeRoute(ROUTE_HOME);
                        }
                      }}
                      title={text}
                      selected={selected}
                      classes={{
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
                        className={classes.listItemText}
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
            );
          }}
        </WithSearch>
        <List>
          <ListItemAccount />
        </List>
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
