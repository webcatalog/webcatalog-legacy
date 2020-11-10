/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';
import { without, sortedIndexBy, orderBy } from 'lodash';

import { INSTALLING } from '../../constants/app-statuses';
import {
  SET_APP,
  REMOVE_APP,
  CLEAN_APP_MANAGEMENT,
  SET_SCANNING_FOR_INSTALLED,
  SORT_APPS,
} from '../../constants/actions';

const apps = (state = {}, action) => {
  switch (action.type) {
    case CLEAN_APP_MANAGEMENT: {
      // keep apps which are in installing/updating state
      const overwritingState = {};
      Object.keys(state).forEach((id) => {
        if (state[id].status === INSTALLING) {
          overwritingState[id] = state[id];
        }
      });

      return overwritingState;
    }
    case SET_APP: {
      const overwritingState = {};
      overwritingState[action.id] = { ...(state[action.id] || {}), ...action.app };

      return { ...state, ...overwritingState };
    }
    case REMOVE_APP: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    default: return state;
  }
};

const iterateeFunc = (app, key) => {
  if (key === 'name') {
    return app.name;
  }
  // action.sortInstalledAppBy === 'last-updated'
  return -(app.lastUpdated || 0);
};
const sortedAppIds = (state = [], action) => {
  switch (action.type) {
    case CLEAN_APP_MANAGEMENT: {
      // keep apps which are in installing/updating state
      const newLst = state.filter((id) => (action.apps[id].status === INSTALLING));
      return newLst;
    }
    case SET_APP: {
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
      return without(state, action.id);
    }
    case SORT_APPS: {
      // resort
      const parts = action.sortInstalledAppBy.split('/');
      const key = parts[0];
      const order = parts.length > 0 ? parts[1] : 'asc';
      return orderBy(state, (id) => {
        const app = action.apps[id];
        return iterateeFunc(app, key);
      }, [order]);
    }
    default: return state;
  }
};

const scanning = (state = true, action) => {
  switch (action.type) {
    case CLEAN_APP_MANAGEMENT: return true;
    case SET_SCANNING_FOR_INSTALLED: return action.scanning;
    default: return state;
  }
};

export default combineReducers({
  apps,
  sortedAppIds,
  scanning,
});
