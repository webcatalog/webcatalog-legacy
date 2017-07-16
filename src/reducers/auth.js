import {
  SET_AUTH_TOKEN,
  SET_AUTH_EMAIL,
  SET_AUTH_PASSWORD,
} from '../constants/actions';

import isEmail from '../tools/isEmail';

const initialState = {
  authToken: null,

  email: '',
  emailErr: null,

  password: '',
  passwordErr: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN: {
      return Object.assign({}, state, { token: action.token });
    }
    case SET_AUTH_EMAIL: {
      if (action.email.length < 1) {
        return Object.assign({}, state, {
          email: action.email,
          emailErr: 'Please enter your email',
        });
      }

      if (isEmail(action.email)) {
        return Object.assign({}, state, {
          email: action.email,
          emailErr: null,
        });
      }

      return Object.assign({}, state, {
        email: action.email,
        emailErr: 'Please enter a valid email',
      });
    }
    case SET_AUTH_PASSWORD: {
      if (action.password.length < 1) {
        return Object.assign({}, state, {
          password: action.password,
          passwordErr: 'Please enter your password',
        });
      }

      return Object.assign({}, state, {
        password: action.password,
        passwordErr: null,
      });
    }
    default:
      return state;
  }
};

export default auth;
