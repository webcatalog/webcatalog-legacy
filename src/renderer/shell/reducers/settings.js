import Immutable from 'immutable';

import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR } from '../constants/actions';
import defaultSettings from '../constants/defaultSettings';

const initialState = Immutable.fromJS({
  isOpen: false,
  swipeToNavigate: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.swipeToNavigate`, defaultSettings.swipeToNavigate),
  rememberLastPage: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.rememberLastPage`, defaultSettings.rememberLastPage),
  quitOnLastWindow: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.quitOnLastWindow`, defaultSettings.quitOnLastWindow),
  customHome: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.customHome`, defaultSettings.customHome),
  injectedCSS: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.injectedCSS`, defaultSettings.injectedCSS),
  injectedJS: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.injectedJS`, defaultSettings.injectedJS),
  customUserAgent: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}.customUserAgent`, defaultSettings.customUserAgent),
});

const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SETTING_DIALOG: {
      return state.set('isOpen', !state.get('isOpen'));
    }
    case SET_BEHAVIOR: {
      return state.set(action.behaviorName, action.behaviorVal);
    }
    default:
      return state;
  }
};

export default settings;
