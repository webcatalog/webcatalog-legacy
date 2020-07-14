import { combineReducers } from 'redux';

import {
  DIALOG_CONTEXT_APP_HELP_CLOSE,
  DIALOG_CONTEXT_APP_HELP_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CONTEXT_APP_HELP_CLOSE: return false;
    case DIALOG_CONTEXT_APP_HELP_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
