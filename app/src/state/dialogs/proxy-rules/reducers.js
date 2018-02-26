import { combineReducers } from 'redux';

import {
  DIALOG_PROXY_RULES_CLOSE,
  DIALOG_PROXY_RULES_OPEN,
  DIALOG_PROXY_RULES_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PROXY_RULES_CLOSE: return false;
    case DIALOG_PROXY_RULES_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  content: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_PROXY_RULES_OPEN: return defaultForm;
    case DIALOG_PROXY_RULES_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
