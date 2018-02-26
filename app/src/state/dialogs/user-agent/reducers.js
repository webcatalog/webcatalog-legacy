import { combineReducers } from 'redux';

import {
  DIALOG_USER_AGENT_CLOSE,
  DIALOG_USER_AGENT_OPEN,
  DIALOG_USER_AGENT_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_USER_AGENT_CLOSE: return false;
    case DIALOG_USER_AGENT_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  content: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_USER_AGENT_OPEN: return defaultForm;
    case DIALOG_USER_AGENT_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
