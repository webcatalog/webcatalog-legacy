import { combineReducers } from 'redux';

import {
  DIALOG_LOCK_APP_CLOSE,
  DIALOG_LOCK_APP_OPEN,
  DIALOG_LOCK_APP_FORM_UPDATE,
  DIALOG_LOCK_APP_MODE_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_LOCK_APP_CLOSE: return false;
    case DIALOG_LOCK_APP_OPEN: return true;
    default: return state;
  }
};

// 0 = Enter Current Password
// 1 = Set A Password
// 2 = Pick An Option
const mode = (state = 0, action) => {
  switch (action.type) {
    case DIALOG_LOCK_APP_MODE_UPDATE: return action.mode;
    case DIALOG_LOCK_APP_OPEN: return 0;
    default: return state;
  }
};


const defaultForm = {
  password: '',
  passwordErr: null,
  confirmPassword: '',
  confirmPasswordErr: null,
  currentPassword: '',
  currentPasswordErr: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_LOCK_APP_OPEN: return defaultForm;
    case DIALOG_LOCK_APP_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  form,
  mode,
  open,
});
