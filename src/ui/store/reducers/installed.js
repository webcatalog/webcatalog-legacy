import Immutable from 'immutable';

import {
  SET_INSTALLED_HITS, SET_INSTALLED_STATUS, LOADING,
} from '../constants/actions';

const initialState = {
  status: LOADING,
  hits: null,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_INSTALLED_STATUS: {
      return Object.assign({}, state, {
        status: action.status,
      });
    }
    case SET_INSTALLED_HITS: {
      return Object.assign({}, state, {
        hits: Immutable.fromJS(action.hits),
      });
    }
    default:
      return state;
  }
};

export default app;
