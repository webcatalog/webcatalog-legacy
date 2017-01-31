import Immutable from 'immutable';

import {
  SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS, NONE,
} from '../constants/actions';

const initialState = {
  query: '',
  status: NONE,
  hits: null,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY: {
      return Object.assign({}, state, {
        query: action.query,
      });
    }
    case SET_SEARCH_STATUS: {
      return Object.assign({}, state, {
        status: action.status,
      });
    }
    case SET_SEARCH_HITS: {
      return Object.assign({}, state, {
        hits: Immutable.fromJS(action.hits),
      });
    }
    default:
      return state;
  }
};

export default app;
