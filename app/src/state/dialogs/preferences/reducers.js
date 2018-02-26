import { combineReducers } from 'redux';

import {
  DIALOG_PREFERENCES_CLOSE,
  DIALOG_PREFERENCES_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PREFERENCES_CLOSE: return false;
    case DIALOG_PREFERENCES_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  open,
});
