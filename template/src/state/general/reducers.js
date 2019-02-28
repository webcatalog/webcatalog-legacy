import { combineReducers } from 'redux';

import {
  UPDATE_DID_FAIL_LOAD,
  UPDATE_IS_DARK_MODE,
  UPDATE_IS_DEFAULT_MAIL_CLIENT,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_LOADING,
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

const isLoading = (state = false, action) => {
  switch (action.type) {
    case UPDATE_IS_LOADING: return action.isLoading;
    default: return state;
  }
};

const didFailLoad = (state = false, action) => {
  switch (action.type) {
    case UPDATE_DID_FAIL_LOAD: return action.didFailLoad;
    default: return state;
  }
};

export default combineReducers({
  didFailLoad,
  isDarkMode,
  isDefaultMailClient,
  isFullScreen,
  isLoading,
});
