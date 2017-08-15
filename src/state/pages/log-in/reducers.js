import { combineReducers } from 'redux';

import {
  LOG_IN_FORM_UPDATE,
} from '../../../constants/actions';

const initialForm = {
  email: '',
  emailError: null,
  password: '',
  passwordError: null,
};

const form = (state = initialForm, action) => {
  switch (action.type) {
    case LOG_IN_FORM_UPDATE: {
      const { changes } = action;
      return Object.assign({}, state, changes);
    }
    default: return state;
  }
};

/*
const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SET_EMAIL: {
      if (action.email.length < 1) {
        return Object.assign({}, state, {
          email: action.email,
          emailError: 'Please enter your email',
        });
      }

      if (isEmail(action.email)) {
        return Object.assign({}, state, {
          email: action.email,
          emailError: null,
        });
      }

      return Object.assign({}, state, {
        email: action.email,
        emailError: 'Please enter a valid email',
      });
    }
    case LOGIN_SET_PASSWORD: {
      if (action.password.length < 1) {
        return Object.assign({}, state, {
          password: action.password,
          passwordError: 'Please enter your password',
        });
      }

      return Object.assign({}, state, {
        password: action.password,
        passwordError: null,
      });
    }
    default:
      return state;
  }
};
*/

export default combineReducers({ form });
