import { combineReducers } from 'redux';

import {
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
  UPDATE_DID_FAIL_LOAD,
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_THEME_SOURCE,
  UPDATE_IS_DEFAULT_MAIL_CLIENT,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_LOADING,
} from '../../constants/actions';

import {
  getThemeSource,
  getShouldUseDarkColors,
} from '../../senders';

const { remote } = window.require('electron');

const canGoBack = (state = false, action) => {
  switch (action.type) {
    case UPDATE_CAN_GO_BACK: return action.canGoBack;
    default: return state;
  }
};

const canGoForward = (state = false, action) => {
  switch (action.type) {
    case UPDATE_CAN_GO_FORWARD: return action.canGoForward;
    default: return state;
  }
};

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

const shouldUseDarkColors = (state = getShouldUseDarkColors(), action) => {
  switch (action.type) {
    case UPDATE_SHOULD_USE_DARK_COLORS: return action.shouldUseDarkColors;
    default: return state;
  }
};

const themeSource = (state = getThemeSource(), action) => {
  switch (action.type) {
    case UPDATE_THEME_SOURCE: return action.themeSource;
    default: return state;
  }
};

const isLoading = (state = true, action) => {
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
  canGoBack,
  canGoForward,
  didFailLoad,
  shouldUseDarkColors,
  themeSource,
  isDefaultMailClient,
  isFullScreen,
  isLoading,
});
