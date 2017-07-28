import { combineReducers } from 'redux';

import {
  DIALOG_SUBMIT_APP_CLOSE,
  DIALOG_SUBMIT_APP_FORM_UPDATE,
  DIALOG_SUBMIT_APP_OPEN,
  DIALOG_SUBMIT_APP_SAVE_REQUEST,
  DIALOG_SUBMIT_APP_SAVE_SUCCESS,
} from '../../../../constants/actions';

// Submit App Dialog
const initialForm = {
  name: null,
  url: null,
};

const form = (state = initialForm, action) => {
  switch (action.type) {
    case DIALOG_SUBMIT_APP_CLOSE: return initialForm;
    case DIALOG_SUBMIT_APP_FORM_UPDATE: {
      const { changes } = action;
      return Object.assign({}, state, changes);
    }
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_SUBMIT_APP_SAVE_REQUEST: return true;
    case DIALOG_SUBMIT_APP_SAVE_SUCCESS: return false;
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_SUBMIT_APP_CLOSE: return false;
    case DIALOG_SUBMIT_APP_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
  open,
});
