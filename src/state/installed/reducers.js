import { combineReducers } from 'redux';

import {
  INSTALLED_UPDATE_ACTIVE_QUERY,
  INSTALLED_UPDATE_QUERY,
} from '../../constants/actions';

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

const filteredSortedAppIds = (state = null, action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_ACTIVE_QUERY: {
      if (!action.activeQuery) return null;
      const processedQuery = action.activeQuery.trim().toLowerCase();
      return action.sortedAppIds.filter((id) => {
        const app = action.apps[id];
        return (
          app.name.toLowerCase().includes(processedQuery)
          || app.url.toLowerCase().includes(processedQuery)
        );
      });
    }
    default: return state;
  }
};


export default combineReducers({
  activeQuery,
  query,
  filteredSortedAppIds,
});
