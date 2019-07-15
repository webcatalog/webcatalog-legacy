import { combineReducers } from 'redux';

import {
  DIALOG_ADD_WORKSPACE_CLOSE,
  DIALOG_ADD_WORKSPACE_FORM_UPDATE,
  DIALOG_ADD_WORKSPACE_OPEN,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ADD_WORKSPACE_CLOSE: return false;
    case DIALOG_ADD_WORKSPACE_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  name: '',
  url: '',
  icon: null,
  category: 'Other',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_ADD_WORKSPACE_CLOSE: return formInitialState;
    case DIALOG_ADD_WORKSPACE_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

export default combineReducers({
  form,
  open,
});
