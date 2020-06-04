import { combineReducers } from 'redux';

import {
  INSTALLED_UPDATE_QUERY,
  INSTALLED_SELECT_APP_IDS,
  INSTALLED_DESELECT_APP_IDS,
  INSTALLED_DESELECT_ALL,
} from '../../constants/actions';

const query = (state = '', action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_QUERY: return action.query;
    default: return state;
  }
};

const selectedAppIdObj = (state = {}, action) => {
  switch (action.type) {
    case INSTALLED_SELECT_APP_IDS: {
      const newObj = { ...state };
      action.ids.forEach((id) => {
        newObj[id] = true;
      });
      return newObj;
    }
    case INSTALLED_DESELECT_APP_IDS: {
      const newObj = { ...state };
      action.ids.forEach((id) => {
        delete newObj[id];
      });
      return newObj;
    }
    case INSTALLED_DESELECT_ALL: {
      return {};
    }
    case INSTALLED_UPDATE_QUERY: {
      return {};
    }
    default: return state;
  }
};

export default combineReducers({
  query,
  selectedAppIdObj,
});
