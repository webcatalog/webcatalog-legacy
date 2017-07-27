import {
  SET_MANAGED_APP,
  REMOVE_MANAGED_APP,
} from '../constants/actions';

const initialState = {
  managedApps: {},
};

const core = (state = initialState, action) => {
  switch (action.type) {
    case SET_MANAGED_APP: {
      const updatedManagedApps = { ...state.managedApps };
      updatedManagedApps[action.id] = {
        status: action.status,
        app: action.app,
      };

      return Object.assign({}, state, {
        managedApps: updatedManagedApps,
      });
    }
    case REMOVE_MANAGED_APP: {
      const updatedManagedApps = { ...state.managedApps };
      delete updatedManagedApps[action.id];

      return Object.assign({}, state, {
        managedApps: updatedManagedApps,
      });
    }
    default:
      return state;
  }
};
export default core;
