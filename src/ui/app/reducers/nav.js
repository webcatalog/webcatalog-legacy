import {
  UPDATE_LOADING, UPDATE_CAN_GO_BACK, UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

const initialState = {
  isLoading: false,
};

const nav = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOADING: {
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
