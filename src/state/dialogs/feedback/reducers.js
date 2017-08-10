import { combineReducers } from 'redux';

import {
  DIALOG_FEEDBACK_CLOSE,
  DIALOG_FEEDBACK_FORM_UPDATE,
  DIALOG_FEEDBACK_OPEN,
  DIALOG_FEEDBACK_SAVE_REQUEST,
  DIALOG_FEEDBACK_SAVE_SUCCESS,
} from '../../../constants/actions';

const initialForm = {
  content: null,
  contentError: null,
};
const form = (state = initialForm, action) => {
  switch (action.type) {
    case DIALOG_FEEDBACK_CLOSE: return initialForm;
    case DIALOG_FEEDBACK_FORM_UPDATE: {
      const { changes } = action;
      return Object.assign({}, state, changes);
    }
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_FEEDBACK_SAVE_REQUEST: return true;
    case DIALOG_FEEDBACK_SAVE_SUCCESS: return false;
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_FEEDBACK_CLOSE: return false;
    case DIALOG_FEEDBACK_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
  open,
});
