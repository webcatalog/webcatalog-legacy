import { combineReducers } from 'redux';

import {
  DIALOG_PREFERENCES_LOCK_CLOSE,
  DIALOG_PREFERENCES_LOCK_OPEN,
  DIALOG_PREFERENCES_LOCK_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PREFERENCES_LOCK_CLOSE: return false;
    case DIALOG_PREFERENCES_LOCK_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  currentPassword: '',
  currentPasswordErr: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_PREFERENCES_LOCK_OPEN: return defaultForm;
    case DIALOG_PREFERENCES_LOCK_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  form,
  open,
});
