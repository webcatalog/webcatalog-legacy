import { combineReducers } from 'redux';

import { SET_APP, REMOVE_APP } from '../../constants/actions';

const apps = (state = {}, action) => {
  switch (action.type) {
    case SET_APP: {
      const overwritingState = {};
      overwritingState[action.id] = Object.assign({}, state[action.id] || {}, action.app);

      return Object.assign({}, state, overwritingState);
    }
    case REMOVE_APP: {
      const newState = Object.assign({}, state);
      delete newState[action.id];
      return newState;
    }
    default: return state;
  }
};

export default combineReducers({
  apps,
});
