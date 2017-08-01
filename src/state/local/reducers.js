import { combineReducers } from 'redux';

import {
  LOCAL_APP_SET,
  LOCAL_APP_REMOVE,
} from '../../constants/actions';

const appsInitialState = {};
const apps = (state = appsInitialState, action) => {
  switch (action.type) {
    case LOCAL_APP_SET: {
      const updatedManagedApps = Object.assign({}, state);

      const currentManageApp = updatedManagedApps[action.id] || {};

      updatedManagedApps[action.id] = {
        status: action.status,
        app: action.app || currentManageApp.app,
      };

      return { ...state, ...updatedManagedApps };
    }
    case LOCAL_APP_REMOVE: {
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
