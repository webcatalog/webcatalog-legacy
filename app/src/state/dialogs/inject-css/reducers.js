import { combineReducers } from 'redux';

import {
  DIALOG_INJECT_CSS_CLOSE,
  DIALOG_INJECT_CSS_OPEN,
  DIALOG_INJECT_CSS_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_INJECT_CSS_CLOSE: return false;
    case DIALOG_INJECT_CSS_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  content: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_INJECT_CSS_OPEN: return defaultForm;
    case DIALOG_INJECT_CSS_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
