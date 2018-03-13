import { combineReducers } from 'redux';

import {
  DIALOG_ACTIVATE_CLOSE,
  DIALOG_ACTIVATE_OPEN,
  DIALOG_ACTIVATE_FORM_UPDATE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACTIVATE_CLOSE: return false;
    case DIALOG_ACTIVATE_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  licenseKey: '',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_ACTIVATE_CLOSE: return formInitialState;
    case DIALOG_ACTIVATE_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

export default combineReducers({ open, form });
