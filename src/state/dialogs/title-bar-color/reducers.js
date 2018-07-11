import { combineReducers } from 'redux';

import {
  DIALOG_TITLE_BAR_COLOR_CLOSE,
  DIALOG_TITLE_BAR_COLOR_OPEN,
  DIALOG_TITLE_BAR_COLOR_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_TITLE_BAR_COLOR_CLOSE: return false;
    case DIALOG_TITLE_BAR_COLOR_OPEN: return true;
    default: return state;
  }
};

const defaultForm = {
  content: null,
};
const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_TITLE_BAR_COLOR_OPEN: return defaultForm;
    case DIALOG_TITLE_BAR_COLOR_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  open,
  form,
});
