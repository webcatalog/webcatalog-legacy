import { combineReducers } from 'redux';

import {
  DIALOG_CONFIRM_UNINSTALL_APP_CLOSE,
  DIALOG_CONFIRM_UNINSTALL_APP_OPEN,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS,
} from '../../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_CONFIRM_UNINSTALL_APP_OPEN: return ({ ...state, ...action.form });
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST: return true;
    case DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS: return false;
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CONFIRM_UNINSTALL_APP_CLOSE: return false;
    case DIALOG_CONFIRM_UNINSTALL_APP_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
  open,
});
