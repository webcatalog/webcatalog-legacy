import Immutable from 'immutable';

import { SET_MANAGED_APP, REMOVE_MANAGED_APP } from '../constants/actions';

const initialState = Immutable.Map({
  managedApps: Immutable.Map({}),
});

const appManagement = (state = initialState, action) => {
  switch (action.type) {
    case SET_MANAGED_APP: {
      return state
        .set(
          'managedApps',
          state.get('managedApps').set(
            action.id, Immutable.fromJS({
              status: action.status,
              app: action.app,
            }),
          ),
        );
    }
    case REMOVE_MANAGED_APP: {
      return state
        .set('managedApps', state.get('managedApps').delete(action.id));
    }
    default:
      return state;
  }
};

export default appManagement;
