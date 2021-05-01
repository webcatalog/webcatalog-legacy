/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import AppSearchAPIConnector from '@elastic/search-ui-app-search-connector';
import {
  SearchProvider, WithSearch, Paging,
} from '@elastic/react-search-ui';
import '@elastic/react-search-ui-views/lib/styles/styles.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';

import StarsIcon from '@material-ui/icons/Stars';
import SearchIcon from '@material-ui/icons/Search';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import CodeIcon from '@material-ui/icons/Code';
import SchoolIcon from '@material-ui/icons/School';
import TheatersIcon from '@material-ui/icons/Theaters';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ForumIcon from '@material-ui/icons/Forum';
import SportsFootballIcon from '@material-ui/icons/SportsFootball';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import BuildIcon from '@material-ui/icons/Build';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import CategoryIcon from '@material-ui/icons/Category';
import SettingsIcon from '@material-ui/icons/Settings';

import connectComponent from '../../../helpers/connect-component';

import EmptyState from '../../shared/empty-state';
import NoConnection from '../../shared/no-connection';
import EnhancedAppBar from '../../shared/enhanced-app-bar';

import DefinedAppBar from './defined-app-bar';
import SecondaryToolbar from './toolbar';
import SubmitAppCard from './submit-app-card';
import CreateCustomAppCard from './create-custom-app-card';

import AppCard from '../../shared/app-card';

import { changeRoute } from '../../../state/router/actions';
import { getAppBadgeCount } from '../../../state/app-management/utils';

import {
  ROUTE_CATEGORIES,
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_PREFERENCES,
} from '../../../constants/routes';

import Preferences from '../preferences';
import Installed from '../installed';

const connector = process.env.REACT_APP_SWIFTYPE_SEARCH_KEY ? new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
}) : null;

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  badConfigRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  loading: {
    marginTop: theme.spacing(2),
  },
  noMatchingResultOpts: {
    marginTop: theme.spacing(4),
  },
  sidebar: {
    width: 320,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[800],
    color: theme.palette.common.white,
    height: '100%',
    overflow: 'auto',
    paddingTop: 0,
    boxShadow: theme.shadows[5],
  },
  sidebarList: {
    paddingTop: 0,
  },
  listItemSelected: {
    backgroundColor: `${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.grey[900]} !important`,
  },
  sidebarInner: {
  },
  sidebarTop: {
    height: 40,
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  listItemIcon: {
    color: theme.palette.common.white,
  },
  mainArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  pageRoot: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flex: 1,
  },
  categoryPage: {
    width: '100%',
    color: theme.palette.text.primary,
    overflow: 'auto',
  },
  scrollContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  categoryList: {
  },
  appBarTitle: {
    textAlign: 'center',
    color: 'inherit',
    fontWeight: 400,
  },
});

const Home = ({
  appBadgeCount,
  classes,
  route,
  onChangeRoute,
}) => {
  const scrollContainerRef = useRef(null);

  if (!connector) {
    return (
      <div
        className={classes.badConfigRoot}
      >
        <Typography
          variant="body1"
          align="center"
          color="textPrimary"
        >
          Swiftype environment variables are required for &quot;Discover&quot;. Learn more at: https://github.com/webcatalog/webcatalog-app/blob/master/README.md#development
        </Typography>
      </div>
    );
  }

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

  const categorySections = {
    business: {
      text: 'Business',
      Icon: BusinessCenterIcon,
    },
    developerTools: {
      text: 'Developer Tools',
      Icon: CodeIcon,
    },
    education: {
      text: 'Education',
      Icon: SchoolIcon,
    },
    entertainment: {
      text: 'Entertainment',
      Icon: TheatersIcon,
    },
    finance: {
      text: 'Finance',
      Icon: AccountBalanceIcon,
    },
    games: {
      text: 'Games',
      Icon: SportsEsportsIcon,
    },
    photographyGraphics: {
      text: 'Photography & Graphics',
      Icon: PhotoLibraryIcon,
    },
    healthFitness: {
      text: 'Health & Fitness',
      Icon: DirectionsRunIcon,
    },
    lifestyle: {
      text: 'Lifestyle',
      Icon: EmojiEmotionsIcon,
    },
    musicAudio: {
      text: 'Music & Audio',
      Icon: MusicNoteIcon,
    },
    newsWeather: {
      text: 'News & Weather',
      Icon: WbSunnyIcon,
    },
    productivity: {
      text: 'Productivity',
      Icon: TrendingUpIcon,
    },
    booksReference: {
      text: 'Books & Reference',
      Icon: LibraryBooksIcon,
    },
    socialNetworking: {
      text: 'Social Networking',
      Icon: ForumIcon,
    },
    sports: {
      text: 'Sports',
      Icon: SportsFootballIcon,
    },
    travel: {
      text: 'Travel',
      Icon: BeachAccessIcon,
    },
    utilities: {
      text: 'Utilities',
      Icon: BuildIcon,
    },
  };

  return (
    <SearchProvider
      config={{
        apiConnector: connector,
        onSearch: (state, queryConfig, next) => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }

          const updatedState = { ...state };
          // when searching, results should ALWAYS be listed by relevance
          if (state.searchTerm.length > 0) {
            updatedState.sortField = '';
            updatedState.sortDirection = '';
          }

          return next(updatedState, queryConfig);
        },
        initialState: {
          sortField: '',
          sortDirection: '',
          filters: [],
        },
        alwaysSearchOnInitialLoad: true,
        searchQuery: {
          resultsPerPage: 59,
          disjunctiveFacets: ['category'],
          result_fields: {
            id: { raw: {} },
            name: { raw: {} },
            url: { raw: {} },
            category: { raw: {} },
            widevine: { raw: {} },
            icon: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_128: window.process.platform === 'win32' ? undefined : { raw: {} },
            icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
            icon_unplated_128: window.process.platform === 'win32' ? { raw: {} } : undefined,
          },
          facets: {
            category: { type: 'value', size: 30 },
          },
          filters: [
            { field: 'widevine', values: [0], type: 'all' },
          ],
        },
      }}
    >
      <div className={classes.root}>
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
                  <>
                    <List className={classes.sidebarList}>
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

                        const listItemComponent = (
                          <ListItem
                            button
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
                            selected={selected}
                            classes={{
                              selected: classes.listItemSelected,
                            }}
                          >
                            <ListItemIcon classes={{ root: classes.listItemIcon }}>
                              {sectionKey === 'updates' ? (
                                <Badge color="secondary" badgeContent={appBadgeCount}>
                                  <Icon fontSize="default" />
                                </Badge>
                              ) : (
                                <Icon fontSize="default" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={text}
                            />
                          </ListItem>
                        );

                        return (
                          <React.Fragment key={sectionKey}>
                            {listItemComponent}
                          </React.Fragment>
                        );
                      })}
                    </List>

                    {/*  */}
                  </>
                );
              }}
            </WithSearch>
          </div>
        </Grid>
        <Grid container className={classes.container}>
          {route === ROUTE_CATEGORIES && (
            <div className={classes.pageRoot}>
              <EnhancedAppBar
                center={(
                  <Typography variant="body1" className={classes.appBarTitle}>
                    Categories
                  </Typography>
                )}
              />
              <div className={classes.categoryPage}>
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
                      <List className={classes.categoryList}>
                        {Object.keys(categorySections).map((sectionKey) => {
                          const {
                            Icon, text, hidden,
                          } = categorySections[sectionKey];
                          if (hidden) return null;

                          const selected = sectionKey !== 'spaces'
                            ? categoryFilter && categoryFilter.values[0] === text
                            : typeFilter && typeFilter.values[0] === 'Multisite';

                          return (
                            <React.Fragment key={sectionKey}>
                              <ListItem
                                button
                                onClick={() => {
                                  clearFilters('category'); // clear all filters except category filter
                                  setFilter('category', text, 'all');
                                  onChangeRoute(ROUTE_HOME);
                                }}
                                selected={selected}
                              >
                                <ListItemIcon>
                                  <Icon fontSize="default" />
                                </ListItemIcon>
                                <ListItemText
                                  primary={text}
                                />
                              </ListItem>
                            </React.Fragment>
                          );
                        })}
                      </List>
                    );
                  }}
                </WithSearch>
              </div>
            </div>
          )}
          {route === ROUTE_INSTALLED && <Installed />}
          {route === ROUTE_PREFERENCES && <Preferences />}
          {route === ROUTE_HOME && (
            <>
              <Grid item xs className={classes.mainArea}>
                <DefinedAppBar />
                <SecondaryToolbar />
                <Divider />
                <div className={classes.scrollContainer} ref={scrollContainerRef}>
                  <Grid item xs container spacing={1} justify="space-evenly">
                    <WithSearch
                      mapContextToProps={({
                        error,
                        filters,
                        isLoading,
                        results,
                        searchTerm,
                        setSearchTerm,
                        wasSearched,
                      }) => ({
                        error,
                        filters,
                        isLoading,
                        results,
                        searchTerm,
                        setSearchTerm,
                        wasSearched,
                      })}
                    >
                      {({
                        error,
                        filters,
                        isLoading,
                        results,
                        searchTerm,
                        setSearchTerm,
                        wasSearched,
                      }) => {
                        if (error) {
                          return (
                            <div className={classes.noConnectionContainer}>
                              <NoConnection
                                onTryAgainButtonClick={() => {
                                  setSearchTerm(searchTerm, { refresh: true, debounce: 0 });
                                }}
                              />
                            </div>
                          );
                        }

                        if (isLoading && !error && results.length < 1) {
                          return (
                            <Grid item xs={12}>
                              <Typography
                                variant="body2"
                                align="center"
                                color="textSecondary"
                                className={classes.loading}
                              >
                                Loading...
                              </Typography>
                            </Grid>
                          );
                        }

                        if (wasSearched && results.length < 1) {
                          return (
                            <EmptyState icon={SearchIcon} title="No Matching Results">
                              <Typography
                                variant="subtitle1"
                                align="center"
                              >
                                Your query did not match any apps in our database.
                              </Typography>
                              <Grid container justify="center" spacing={1} className={classes.noMatchingResultOpts}>
                                <SubmitAppCard />
                                <CreateCustomAppCard />
                              </Grid>
                            </EmptyState>
                          );
                        }

                        const typeFilter = filters.find((filter) => filter.field === 'type');
                        return (
                          <>
                            <CreateCustomAppCard urlDisabled={typeFilter && typeFilter.values[0] === 'Multisite'} />
                            {results.map((app) => (
                              <AppCard
                                key={app.id.raw}
                                id={app.id.raw}
                                name={app.name.raw}
                                url={app.url.raw}
                                category={app.category.raw}
                                widevine={app.widevine.raw === 1}
                                icon={window.process.platform === 'win32' // use unplated icon for Windows
                                  ? app.icon_unplated.raw : app.icon.raw}
                                iconThumbnail={window.process.platform === 'win32' // use unplated icon for Windows
                                  ? app.icon_unplated_128.raw : app.icon_128.raw}
                              />
                            ))}
                            <Grid item xs={12} container justify="center">
                              <Paging />
                            </Grid>
                          </>
                        );
                      }}
                    </WithSearch>
                  </Grid>
                </div>
              </Grid>
            </>
          )}
        </Grid>
      </div>
    </SearchProvider>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  route: PropTypes.string.isRequired,
  appBadgeCount: PropTypes.number.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  activated: state.general.activated,
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
