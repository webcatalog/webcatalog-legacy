import Immutable from 'immutable';

import { SET_INSTALLED_HITS, SET_INSTALLED_STATUS } from '../constants/actions';
import { LOADING } from '../constants/statuses';

const initialState = Immutable.Map({
  status: LOADING,
  hits: null,
});

const installed = (state = initialState, action) => {
  switch (action.type) {
    case SET_INSTALLED_STATUS: {
      return state.set('status', action.status);
    }
    case SET_INSTALLED_HITS: {
      return state.set('hits', Immutable.fromJS(action.hits));
    }
    default:
      return state;
  }
};

export default installed;
