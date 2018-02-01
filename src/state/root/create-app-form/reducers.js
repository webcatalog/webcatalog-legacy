import { combineReducers } from 'redux';

import {
  DIALOG_CREATE_CUSTOM_APP_CREATE_FAILED,
  DIALOG_CREATE_CUSTOM_APP_CREATE_REQUEST,
  DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
} from '../../../constants/actions';

const formInitialState = {
  name: '',
  url: '',
  location: window.platform === 'darwin' ? '/Applications' : window.desktopPath,
  icon: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS: return formInitialState;
    case DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const isCreating = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CREATE_CUSTOM_APP_CREATE_FAILED: return false;
    case DIALOG_CREATE_CUSTOM_APP_CREATE_REQUEST: return true;
    case DIALOG_CREATE_CUSTOM_APP_CREATE_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  form,
  isCreating,
});
