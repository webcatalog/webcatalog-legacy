import { combineReducers } from 'redux';

import {
  DIALOG_RELAUNCH_CLOSE,
  DIALOG_RELAUNCH_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_RELAUNCH_CLOSE: return false;
    case DIALOG_RELAUNCH_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  open,
});
