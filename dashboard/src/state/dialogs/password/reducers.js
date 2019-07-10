import { combineReducers } from 'redux';

import {
  DIALOG_ACCOUNT_PASSWORD_CLOSE,
  DIALOG_ACCOUNT_PASSWORD_FORM_UPDATE,
  DIALOG_ACCOUNT_PASSWORD_OPEN,
  DIALOG_ACCOUNT_PASSWORD_SAVE_REQUEST,
  DIALOG_ACCOUNT_PASSWORD_SAVE_SUCCESS,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PASSWORD_CLOSE: return false;
    case DIALOG_ACCOUNT_PASSWORD_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  currentPassword: '',
  currentPasswordError: null,
  password: '',
  passwordError: null,
  confirmPassword: '',
  confirmPasswordError: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PASSWORD_CLOSE: return formInitialState;
    case DIALOG_ACCOUNT_PASSWORD_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PASSWORD_SAVE_REQUEST: return true;
    case DIALOG_ACCOUNT_PASSWORD_SAVE_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
  open,
});
