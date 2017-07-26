import { combineReducers } from 'redux';

import {
  DIALOG_APP_DETAILS_CLOSE,
  DIALOG_APP_DETAILS_OPEN,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_APP_DETAILS_OPEN: return ({ ...state, ...action.form });
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_APP_DETAILS_CLOSE: return false;
    case DIALOG_APP_DETAILS_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  open,
});
