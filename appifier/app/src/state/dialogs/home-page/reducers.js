import { combineReducers } from 'redux';

import {
  DIALOG_HOME_PAGE_CLOSE,
  DIALOG_HOME_PAGE_OPEN,
  DIALOG_HOME_PAGE_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_HOME_PAGE_CLOSE: return false;
    case DIALOG_HOME_PAGE_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  content: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_HOME_PAGE_OPEN: return defaultForm;
    case DIALOG_HOME_PAGE_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
