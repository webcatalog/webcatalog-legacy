import { combineReducers } from 'redux';

import {
  DIALOG_PROXY_CLOSE,
  DIALOG_PROXY_FORM_UPDATE,
  DIALOG_PROXY_OPEN,
} from '../../constants/actions';

import { getPreferences } from '../../senders';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_PROXY_CLOSE: return false;
    case DIALOG_PROXY_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_PROXY_OPEN: {
      const {
        proxyBypassRules,
        proxyPacScript,
        proxyRules,
        proxyType,
      } = getPreferences();

      return {
        proxyBypassRules,
        proxyPacScript,
        proxyRules,
        proxyType,
      };
    }
    case DIALOG_PROXY_CLOSE: return formInitialState;
    case DIALOG_PROXY_FORM_UPDATE: {
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
