import {
  SET_AUTH_TOKEN,
} from '../constants/actions';

const initialState = {
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN: {
      return Object.assign({}, state, { token: action.token });
    }
    default:
      return state;
  }
};

export default auth;
