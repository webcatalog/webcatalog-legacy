import Immutable from 'immutable';

import {
  UPDATE_TARGET_URL, UPDATE_LOADING, UPDATE_CAN_GO_BACK, UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

const initialState = Immutable.Map({
  isLoading: false,
  targetUrl: null,
});

const nav = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TARGET_URL: {
      return state.set('targetUrl', action.targetUrl);
    }
    case UPDATE_LOADING: {
      return state.set('isLoading', action.isLoading);
    }
    case UPDATE_CAN_GO_BACK: {
      return state.set('canGoBack', action.canGoBack);
    }
    case UPDATE_CAN_GO_FORWARD: {
      return state.set('canGoForward', action.canGoForward);
    }
    default:
      return state;
  }
};

export default nav;
