import { combineReducers } from 'redux';

import { SET_APP, REMOVE_APP, CLEAN_APP_MANAGEMENT } from '../../constants/actions';

const apps = (state = {}, action) => {
  switch (action.type) {
    case CLEAN_APP_MANAGEMENT: {
      return {};
    }
    case SET_APP: {
      const overwritingState = {};
      overwritingState[action.id] = { ...state[action.id] || {}, ...action.app };

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

export default combineReducers({
  apps,
});
