import { combineReducers } from 'redux';

import {
  UPDATE_IS_DARK_MODE,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_DEFAULT_MAIL_CLIENT,
} from '../../constants/actions';

const { remote } = window.require('electron');

const isFullScreen = (state = remote.getCurrentWindow().isFullScreen(), action) => {
  switch (action.type) {
    case UPDATE_IS_FULL_SCREEN: return action.isFullScreen;
    default: return state;
  }
};


const isDefaultMailClient = (state = remote.app.isDefaultProtocolClient('mailto'), action) => {
  switch (action.type) {
    case UPDATE_IS_DEFAULT_MAIL_CLIENT: return action.isDefaultMailClient;
    default: return state;
  }
};

const isDarkMode = (state = remote.systemPreferences.isDarkMode(), action) => {
  switch (action.type) {
    case UPDATE_IS_DARK_MODE: return action.isDarkMode;
    default: return state;
  }
};

export default combineReducers({
  isDarkMode,
  isDefaultMailClient,
  isFullScreen,
});
