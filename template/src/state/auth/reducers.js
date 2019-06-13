import { combineReducers } from 'redux';

import { UPDATE_AUTH_FORM } from '../../constants/actions';

const defaultForm = {
  username: '',
  password: '',
};

const form = (state = defaultForm, action) => {
  switch (action.type) {
    case UPDATE_AUTH_FORM: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({ form });
