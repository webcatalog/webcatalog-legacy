import {
  AUTH_SET_TOKEN,
} from '../../../constants/actions';

const initialState = {
  token: window.localStorage.getItem('token'),
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN: {
      if (action.token) {
        window.localStorage.setItem('token', action.token);
      } else {
        window.localStorage.removeItem('token');
      }

      return Object.assign({}, state, { token: action.token });
    }
    default:
      return state;
  }
};

export default auth;
