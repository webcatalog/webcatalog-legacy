import { combineReducers } from 'redux';

import {
  DIALOG_REFERRAL_CLOSE,
  DIALOG_REFERRAL_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_REFERRAL_CLOSE: return false;
    case DIALOG_REFERRAL_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
