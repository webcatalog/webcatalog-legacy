import Immutable from 'immutable';

import { SET_INSTALLED_APPS } from '../constants/actions';

const initialState = Immutable.Map({
  installedApps: Immutable.List([]),
});

const installed = (state = initialState, action) => {
  switch (action.type) {
    case SET_INSTALLED_APPS: {
      return state.set('installedApps', action.installedApps);
    }
    default:
      return state;
  }
};

export default installed;
