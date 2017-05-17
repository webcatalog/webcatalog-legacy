import Immutable from 'immutable';

import { SET_SEARCH_QUERY, SET_SEARCH_HITS, SET_SEARCH_STATUS } from '../constants/actions';
import { NONE } from '../constants/statuses';

const initialState = Immutable.Map({
  query: '',
  status: NONE,
  hits: null,
});

const search = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_QUERY: {
      return state.set('query', action.query);
    }
    case SET_SEARCH_STATUS: {
      return state.set('status', action.status);
    }
    case SET_SEARCH_HITS: {
      return state.set('hits', Immutable.fromJS(action.hits));
    }
    default:
      return state;
  }
};

export default search;
