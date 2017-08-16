import { combineReducers } from 'redux';

import {
  DIALOG_PREFERENCES_CLOSE,
  DIALOG_PREFERENCES_ADVANCED_FORM_UPDATE,
  DIALOG_PREFERENCES_ADVANCED_SAVE_REQUEST,
  DIALOG_PREFERENCES_ADVANCED_SAVE_SUCCESS,
} from '../../../../constants/actions';

const formInitialState = {
  injectedCss: '',
  injectedCssError: null,
  injectedJs: '',
  injectedJsError: null,
  customUserAgent: '',
  customUserAgentError: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_PREFERENCES_CLOSE: return formInitialState;
    case DIALOG_PREFERENCES_ADVANCED_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const isSaving = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PREFERENCES_ADVANCED_SAVE_REQUEST: return true;
    case DIALOG_PREFERENCES_ADVANCED_SAVE_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({
  form,
  isSaving,
});
