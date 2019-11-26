import { combineReducers } from 'redux';

import {
  DIALOG_CHOOSE_ENGINE_CLOSE,
  DIALOG_CHOOSE_ENGINE_FORM_UPDATE,
  DIALOG_CHOOSE_ENGINE_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CHOOSE_ENGINE_CLOSE: return false;
    case DIALOG_CHOOSE_ENGINE_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  engine: 'electron',
  icon: null,
  id: '',
  name: '',
  url: '',
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_CHOOSE_ENGINE_OPEN: return {
      ...formInitialState,
      engine: action.engine,
      icon: action.icon,
      id: action.id,
      name: action.name,
      url: action.url,
    };
    case DIALOG_CHOOSE_ENGINE_CLOSE: return formInitialState;
    case DIALOG_CHOOSE_ENGINE_FORM_UPDATE: {
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
