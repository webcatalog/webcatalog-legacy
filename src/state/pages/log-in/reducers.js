import {
  LOGIN_SET_EMAIL,
  LOGIN_SET_PASSWORD,
} from '../../../constants/actions';

import isEmail from '../../../utils/is-email';

const initialState = {
  email: '',
  emailErr: null,

  password: '',
  passwordErr: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SET_EMAIL: {
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
    case LOGIN_SET_PASSWORD: {
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
