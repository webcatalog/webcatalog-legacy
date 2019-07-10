import { combineReducers } from 'redux';

import {
  DIALOG_ACCOUNT_PROFILE_FORM_UPDATE,
  DIALOG_ACCOUNT_PROFILE_SAVE_REQUEST,
  DIALOG_ACCOUNT_PROFILE_SAVE_SUCCESS,
  DIALOG_ACCOUNT_PROFILE_OPEN,
  DIALOG_ACCOUNT_PROFILE_CLOSE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PROFILE_CLOSE: return false;
    case DIALOG_ACCOUNT_PROFILE_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  displayName: '',
  email: '',
  emailError: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PROFILE_CLOSE: return formInitialState;
    case DIALOG_ACCOUNT_PROFILE_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_PROFILE_SAVE_REQUEST: return true;
    case DIALOG_ACCOUNT_PROFILE_SAVE_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
  open,
});
