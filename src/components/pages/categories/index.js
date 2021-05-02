/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import {
  WithSearch,
} from '@elastic/react-search-ui';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import CodeIcon from '@material-ui/icons/Code';
import SchoolIcon from '@material-ui/icons/School';
import TheatersIcon from '@material-ui/icons/Theaters';
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

import DefinedAppBar from './defined-app-bar';

import { changeRoute } from '../../../state/router/actions';

import connectComponent from '../../../helpers/connect-component';

import {
  ROUTE_HOME,
} from '../../../constants/routes';

const styles = (theme) => ({
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
});

const Categories = ({ classes, onChangeRoute }) => {
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
    <div className={classes.pageRoot}>
      <DefinedAppBar />
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
  );
};

Categories.propTypes = {
  classes: PropTypes.object.isRequired,
  onChangeRoute: PropTypes.func.isRequired,
};

const actionCreators = {
  changeRoute,
};

export default connectComponent(
  Categories,
  null,
  actionCreators,
  styles,
);
