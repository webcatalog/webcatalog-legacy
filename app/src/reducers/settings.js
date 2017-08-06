/* global ipcRenderer */
import { TOGGLE_SETTING_DIALOG } from '../constants/actions';

const initialState = {
  isOpen: false,
  ...ipcRenderer.sendSync('get-settings'),
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SETTING_DIALOG: {
      return Object.assign({}, state, {
        isOpen: action.isOpen,
      });
    }
    default:
      return state;
  }
};

export default settings;
