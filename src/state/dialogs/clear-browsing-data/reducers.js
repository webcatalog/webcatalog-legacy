import { combineReducers } from 'redux';

import {
  DIALOG_CLEAR_BROWSING_DATA_CLOSE,
  DIALOG_CLEAR_BROWSING_DATA_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CLEAR_BROWSING_DATA_CLOSE: return false;
    case DIALOG_CLEAR_BROWSING_DATA_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  open,
});
