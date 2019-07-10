import { combineReducers } from 'redux';

import {
  LOG_IN_FORM_UPDATE,
  LOG_IN_SUBMIT_REQUEST,
  LOG_IN_SUBMIT_SUCCESS,
  LOG_IN_SUBMIT_FAILED,
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

const isSubmitting = (state = false, action) => {
  switch (action.type) {
    case LOG_IN_SUBMIT_REQUEST: return true;
    case LOG_IN_SUBMIT_SUCCESS: return false;
    case LOG_IN_SUBMIT_FAILED: return false;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSubmitting,
});
