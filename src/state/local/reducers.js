import { combineReducers } from 'redux';

import {
  LOCAL_SET_APP,
  LOCAL_REMOVE_APP,
} from '../../constants/actions';

const appsInitialState = {};
const apps = (state = appsInitialState, action) => {
  switch (action.type) {
    case LOCAL_SET_APP: {
      const updatedManagedApps = Object.assign({}, state);

      const currentManageApp = updatedManagedApps[action.id] || {};

      updatedManagedApps[action.id] = {
        status: action.status,
        app: action.app || currentManageApp.app,
      };

      return { ...state, ...updatedManagedApps };
    }
    case LOCAL_REMOVE_APP: {
      const updatedManagedApps = state;

      delete updatedManagedApps[action.id];

      return { ...state, ...updatedManagedApps };
    }
    default:
      return state;
  }
};

export default combineReducers({
  apps,
});
