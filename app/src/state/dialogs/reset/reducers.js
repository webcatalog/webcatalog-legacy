import { combineReducers } from 'redux';

import {
  DIALOG_RESET_CLOSE,
  DIALOG_RESET_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_RESET_CLOSE: return false;
    case DIALOG_RESET_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  open,
});
