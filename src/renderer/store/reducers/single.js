import Immutable from 'immutable';

import { SET_SINGLE_APP, SET_SINGLE_IS_FAILED } from '../constants/actions';

const initialState = Immutable.Map({
  app: null,
  isFailed: false,
});

const single = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_APP:
      return state.set('app', action.app);
    case SET_SINGLE_IS_FAILED:
      return state.set('isFailed', action.isFailed);
    default:
      return state;
  }
};

export default single;
