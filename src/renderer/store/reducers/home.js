import Immutable from 'immutable';

import { SET_STATUS, ADD_APPS, REMOVE_RESULTS, SET_CATEGORY, SET_SORT } from '../constants/actions';
import { LOADING } from '../constants/statuses';

const initialState = Immutable.Map({
  status: LOADING,
  apps: Immutable.List([]),
  currentPage: 0,
  totalPage: null,
  appStatus: Immutable.Map({}),
  category: null,
  sort: null,
});

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATUS: {
      return state.set('status', action.status);
    }
    case ADD_APPS: {
      const chunk = Immutable.fromJS(action.chunk);

      return state
        .set('apps', state.get('apps').concat(Immutable.fromJS(chunk)))
        .set('currentPage', action.currentPage)
        .set('totalPage', action.totalPage);
    }
    case REMOVE_RESULTS: {
      return initialState
        .set('category', state.get('category'))
        .set('sort', state.get('sort'));
    }
    case SET_CATEGORY: {
      return state.set('category', action.category);
    }
    case SET_SORT: {
      return state.set('sort', action.sort);
    }
    default:
      return state;
  }
};

export default app;
