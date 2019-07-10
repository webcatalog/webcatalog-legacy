import { combineReducers } from 'redux';

import {
  DIALOG_WORKSPACE_CLOSE,
  DIALOG_WORKSPACE_OPEN,
  DIALOG_WORKSPACE_FORM_UPDATE,
} from '../../../constants/actions';

const formInitialState = {
  workspaceName: '',
  workspaceNameError: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_WORKSPACE_CLOSE: return formInitialState;
    case DIALOG_WORKSPACE_OPEN: return action.workspace;
    case DIALOG_WORKSPACE_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_WORKSPACE_CLOSE: return false;
    case DIALOG_WORKSPACE_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  open,
});
