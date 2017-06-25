import Immutable from 'immutable';

import {
  UPDATE_TARGET_URL,
  UPDATE_IS_FAILED,
  UPDATE_IS_LOADING,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

const initialState = Immutable.Map({
  isFailed: false,
  isLoading: false,
  targetUrl: null,
  canGoBack: false,
  canGoForward: false,
});

const nav = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TARGET_URL: {
      return state.set('targetUrl', action.targetUrl);
    }
    case UPDATE_IS_FAILED: {
      return state.set('isFailed', action.isFailed);
    }
    case UPDATE_IS_LOADING: {
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
