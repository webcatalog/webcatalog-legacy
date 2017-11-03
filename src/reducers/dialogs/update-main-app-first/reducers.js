import { combineReducers } from 'redux';

import {
  DIALOG_UPDATE_WEBCATALOG_FIRST_CLOSE,
  DIALOG_UPDATE_WEBCATALOG_FIRST_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_UPDATE_WEBCATALOG_FIRST_CLOSE: return false;
    case DIALOG_UPDATE_WEBCATALOG_FIRST_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
