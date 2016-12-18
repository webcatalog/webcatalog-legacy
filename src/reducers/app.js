import Immutable from 'immutable';

import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, LOADING,
} from '../constants/actions';

const initialState = {
  status: LOADING,
  apps: null,
  currentPage: -1,
  totalPage: null,
  appStatus: Immutable.fromJS({}),
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATUS: {
      return Object.assign({}, state, {
        status: action.status,
      });
    }
    case ADD_APPS: {
      const chunk = Immutable.fromJS(action.chunk);

      let apps;
      if (state.apps) {
        apps = state.apps.concat(Immutable.fromJS(chunk));
      } else {
        apps = chunk;
      }

      return Object.assign({}, state, {
        apps,
        currentPage: action.currentPage,
        totalPage: action.totalPage,
      });
    }
    case ADD_APP_STATUS: {
      return Object.assign({}, state, {
        appStatus: state.appStatus.set(action.id, action.status),
      });
    }
    case REMOVE_APP_STATUS: {
      return Object.assign({}, state, {
        appStatus: state.appStatus.delete(action.id),
      });
    }
    default:
      return state;
  }
};

export default app;
