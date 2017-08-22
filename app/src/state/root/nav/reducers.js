import {
  UPDATE_TARGET_URL,
  UPDATE_IS_FAILED,
  UPDATE_IS_LOADING,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../../../constants/actions';

const initialState = {
  isFailed: false,
  isLoading: true,
  targetUrl: null,
  canGoBack: false,
  canGoForward: false,
};

const nav = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TARGET_URL: {
      return Object.assign({}, state, {
        targetUrl: action.targetUrl,
      });
    }
    case UPDATE_IS_FAILED: {
      return Object.assign({}, state, {
        isFailed: action.isFailed,
      });
    }
    case UPDATE_IS_LOADING: {
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });
    }
    case UPDATE_CAN_GO_BACK: {
      return Object.assign({}, state, {
        canGoBack: action.canGoBack,
      });
    }
    case UPDATE_CAN_GO_FORWARD: {
      return Object.assign({}, state, {
        canGoForward: action.canGoForward,
      });
    }
    default:
      return state;
  }
};

export default nav;
