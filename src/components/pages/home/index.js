/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
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

import SearchIcon from '@material-ui/icons/Search';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import CodeIcon from '@material-ui/icons/Code';
import SchoolIcon from '@material-ui/icons/School';
import TheatersIcon from '@material-ui/icons/Theaters';
import AppsIcon from '@material-ui/icons/Apps';
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
// import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

import connectComponent from '../../../helpers/connect-component';

import EmptyState from '../../shared/empty-state';
import NoConnection from '../../shared/no-connection';

import DefinedAppBar from './defined-app-bar';
import SecondaryToolbar from './toolbar';
import SubmitAppCard from './submit-app-card';
import CreateCustomAppCard from './create-custom-app-card';

import AppCard from '../../shared/app-card';

const connector = process.env.REACT_APP_SWIFTYPE_SEARCH_KEY ? new AppSearchAPIConnector({
  searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
  engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
  hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
}) : null;

const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
    width: 250,
    color: theme.palette.text.primary,
    height: '100%',
    overflow: 'auto',
    paddingTop: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  sidebarInner: {
  },
  mainArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
    // marginTop: theme.spacing(4),
  },
});

const Home = ({
  classes,
}) => {
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
      text: 'All Apps & Spaces',
      Icon: AppsIcon,
    },
    /*
    installed: {
      text: 'Installed Apps & Spaces',
      Icon: SystemUpdateIcon,
    },
    */
  };

  const categorySections = {
    spaces: {
      text: 'Spaces',
      Icon: GroupWorkIcon,
    },
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
          const updatedState = { ...state };
          // when searching, results should ALWAYS be listed by relevance
          if (state.searchTerm.length > 0) {
            updatedState.sortField = '';
            updatedState.sortDirection = '';
          }
          return next(updatedState, queryConfig);
        },
        initialState: {
          resultsPerPage: 60,
          sortField: '',
          sortDirection: '',
          filters: [],
        },
        alwaysSearchOnInitialLoad: true,
        searchQuery: {
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
        <DefinedAppBar />
        <Grid container className={classes.container}>
          <Grid item className={classes.sidebar}>
            <div className={classes.sidebarInner}>
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
                      <List dense>
                        {Object.keys(mainSections).map((sectionKey) => {
                          const {
                            Icon, text, hidden,
                          } = mainSections[sectionKey];
                          if (hidden) return null;

                          const selected = sectionKey === 'all'
                            ? categoryFilter == null && typeFilter == null
                            : false;

                          return (
                            <React.Fragment key={sectionKey}>
                              <ListItem
                                button
                                onClick={() => {
                                  if (sectionKey === 'all') {
                                    clearFilters();
                                  }
                                }}
                                selected={selected}
                              >
                                <ListItemIcon>
                                  <Icon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={text}
                                />
                              </ListItem>
                            </React.Fragment>
                          );
                        })}
                      </List>

                      <List dense className={classes.categoryList}>
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
                                  if (sectionKey === 'spaces') {
                                    clearFilters('type'); // clear all filters except type filter
                                    setFilter('type', 'Multisite', 'all');
                                  } else {
                                    clearFilters('category'); // clear all filters except category filter
                                    setFilter('category', text, 'all');
                                  }
                                }}
                                selected={selected}
                              >
                                <ListItemIcon>
                                  <Icon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={text}
                                />
                              </ListItem>
                            </React.Fragment>
                          );
                        })}
                      </List>
                    </>
                  );
                }}
              </WithSearch>
            </div>
          </Grid>
          <Grid item xs className={classes.mainArea}>
            <SecondaryToolbar />
            <Divider />
            <div className={classes.scrollContainer}>
              <Grid item xs container spacing={1} justify="space-evenly">
                <WithSearch
                  mapContextToProps={({
                    error,
                    isLoading,
                    results,
                    searchTerm,
                    setSearchTerm,
                    wasSearched,
                  }) => ({
                    error,
                    isLoading,
                    results,
                    searchTerm,
                    setSearchTerm,
                    wasSearched,
                  })}
                >
                  {({
                    error,
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

                    return (
                      <>
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
        </Grid>
      </div>
    </SearchProvider>
  );
};

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  Home,
  null,
  null,
  styles,
);
