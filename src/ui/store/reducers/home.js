import Immutable from 'immutable';

import { SET_STATUS, ADD_APPS, RESET_HOME } from '../constants/actions';
import { LOADING } from '../constants/statuses';

const initialState = Immutable.Map({
  status: LOADING,
  apps: Immutable.List([]),
  currentPage: -1,
  totalPage: null,
  appStatus: Immutable.Map({}),
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
    case RESET_HOME: {
      return initialState;
    }
    default:
      return state;
  }
};

export default app;
