import { combineReducers } from 'redux';

import {
  DIALOG_EDIT_APP_CLOSE,
  DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE,
  DIALOG_EDIT_APP_FORM_UPDATE,
  DIALOG_EDIT_APP_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_EDIT_APP_CLOSE: return false;
    case DIALOG_EDIT_APP_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  engine: 'electron',
  name: '',
  url: 'https://',
  urlDisabled: false,
  icon: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_EDIT_APP_OPEN: return { ...formInitialState, ...action.form };
    case DIALOG_EDIT_APP_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const downloadingIcon = (state = false, action) => {
  switch (action.type) {
    case DIALOG_EDIT_APP_OPEN: return false;
    case DIALOG_EDIT_APP_DOWNLOADING_ICON_UPDATE: return action.downloadingIcon;
    default: return state;
  }
};

const savable = (state = false, action) => {
  switch (action.type) {
    case DIALOG_EDIT_APP_OPEN: return false;
    case DIALOG_EDIT_APP_FORM_UPDATE: return true;
    case DIALOG_EDIT_APP_CLOSE: return false;
    default: return state;
  }
};

export default combineReducers({
  downloadingIcon,
  form,
  open,
  savable,
});
