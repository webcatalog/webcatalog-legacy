import { combineReducers } from 'redux';

import {
  DIALOG_ABOUT_CLOSE,
  DIALOG_ABOUT_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ABOUT_CLOSE: return false;
    case DIALOG_ABOUT_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
