import Immutable from 'immutable';

import { SET_MY_APPS_STATUS, ADD_MY_APPS_APPS, REMOVE_MY_APPS_RESULTS } from '../constants/actions';
import { LOADING } from '../constants/statuses';

const initialState = Immutable.Map({
  status: LOADING,
  apps: Immutable.List([]),
  currentPage: 0,
  totalPage: null,
  appStatus: Immutable.Map({}),
});

const myApps = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_APPS_STATUS: {
      return state.set('status', action.status);
    }
    case ADD_MY_APPS_APPS: {
      const chunk = Immutable.fromJS(action.chunk);

      return state
        .set('apps', state.get('apps').concat(Immutable.fromJS(chunk)))
        .set('currentPage', action.currentPage)
        .set('totalPage', action.totalPage);
    }
    case REMOVE_MY_APPS_RESULTS: {
      return initialState;
    }
    default:
      return state;
  }
};

export default myApps;
