import {
  UPDATE_LOADING,
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
    default:
      return state;
  }
};

export default nav;
