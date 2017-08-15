import {
  AUTH_SET_TOKEN,
} from '../../../constants/actions';

const initialState = {
  token: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN: {
      return Object.assign({}, state, { token: action.token });
    }
    default:
      return state;
  }
};

export default auth;
