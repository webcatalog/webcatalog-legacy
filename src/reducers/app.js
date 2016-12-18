import Immutable from 'immutable';

import {
  SET_STATUS, ADD_APPS, ADD_APP_STATUS, REMOVE_APP_STATUS, LOADING,
} from '../constants/actions';

const initialState = {
  status: LOADING,
  apps: null,
  currentPage: null,
  totalPage: null,
  installedApps: Immutable.fromJS({}),
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

      return Object.assign({}, state, { apps });
    }
    case ADD_APP_STATUS: {
      return Object.assign({}, state, {
        installedApps: state.installedApps.set(action.id, action.status),
      });
    }
    case REMOVE_APP_STATUS: {
      return Object.assign({}, state, {
        installedApps: state.installedApps.delete(action.id),
      });
    }
    default:
      return state;
  }
};

export default app;
