import { combineReducers } from 'redux';
import { without, sortedIndexBy, orderBy } from 'lodash';

import {
  INSTALLED_UPDATE_ACTIVE_QUERY,
  INSTALLED_UPDATE_QUERY,
  INSTALLED_UPDATE_SCROLL_OFFSET,
  INSTALLED_SET_IS_SEARCHING,
  SET_APP,
  REMOVE_APP,
  CLEAN_APP_MANAGEMENT,
  SORT_APPS,
} from '../../constants/actions';

import { INSTALLING } from '../../constants/app-statuses';

const isSearching = (state = false, action) => {
  switch (action.type) {
    case INSTALLED_SET_IS_SEARCHING: return action.isSearching;
    default: return state;
  }
};

const query = (state = '', action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_QUERY: return action.query;
    default: return state;
  }
};

const activeQuery = (state = '', action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_ACTIVE_QUERY: return action.activeQuery;
    default: return state;
  }
};

const iterateeFunc = (app, sortInstalledAppBy) => {
  if (sortInstalledAppBy === 'name') {
    return app.name;
  }
  // action.sortInstalledAppBy === 'last-updated'
  return -(app.lastUpdated || 0);
};
const filteredSortedAppIds = (state = null, action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_ACTIVE_QUERY: {
      return action.sortedAppIds;
    }
    case CLEAN_APP_MANAGEMENT: {
      // keep apps which are in installing/updating state
      if (!state) return null;
      const newLst = state.filter((id) => (action.apps[id].status === INSTALLING));
      return newLst;
    }
    case SET_APP: {
      if (!state) return null;

      // if the app is not supposed to be in search result
      // just return the current state
      const processedQuery = action.activeQuery.trim().toLowerCase();
      const currentApp = { ...action.apps[action.id], ...action.app };
      if (!(
        currentApp.name.toLowerCase().includes(processedQuery)
        || currentApp.url.toLowerCase().includes(processedQuery)
      )) {
        return state;
      }

      // if id is not in list, insert at sorted position
      if (state.indexOf(action.id) < 0) {
        const index = sortedIndexBy(state, action.id, (id) => {
          const app = id === action.id ? { ...action.apps[id], ...action.app } : action.apps[id];
          return iterateeFunc(app, action.sortInstalledAppBy);
        });
        state.splice(index, 0, action.id);
        return [...state];
      }
      // if sorting value is updated, remove and reinsert id at new index
      if (
        (action.sortInstalledAppBy === 'name' && action.app.name)
        || (action.sortInstalledAppBy === 'last-updated' && (action.app.lastUpdated))
      ) {
        const newState = without(state, action.id);
        const index = sortedIndexBy(newState, action.id, (id) => {
          const app = id === action.id ? { ...action.apps[id], ...action.app } : action.apps[id];
          return iterateeFunc(app, action.sortInstalledAppBy);
        });
        newState.splice(index, 0, action.id);
        return newState;
      }
      return state;
    }
    case REMOVE_APP: {
      if (!state) return null;
      return without(state, action.id);
    }
    case SORT_APPS: {
      if (!state) return null;
      // resort
      return orderBy(state, (id) => {
        const app = action.apps[id];
        return iterateeFunc(app, action.sortInstalledAppBy);
      });
    }
    default: return state;
  }
};

const scrollOffset = (state = 0, action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_SCROLL_OFFSET: return action.scrollOffset;
    default: return state;
  }
};

export default combineReducers({
  activeQuery,
  filteredSortedAppIds,
  isSearching,
  query,
  scrollOffset,
});
