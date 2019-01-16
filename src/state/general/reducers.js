import { combineReducers } from 'redux';

import {
  UPDATE_IS_DARK_MODE,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
} from '../../constants/actions';

const { remote } = window.require('electron');

const isFullScreen = (state = remote.getCurrentWindow().isFullScreen(), action) => {
  switch (action.type) {
    case UPDATE_IS_FULL_SCREEN: return action.isFullScreen;
    default: return state;
  }
};

const isDarkMode = (state = remote.systemPreferences.isDarkMode(), action) => {
  switch (action.type) {
    case UPDATE_IS_DARK_MODE: return action.isDarkMode;
    default: return state;
  }
};

const latestTemplateVersion = (state = '0.0.0', action) => {
  switch (action.type) {
    case UPDATE_LATEST_TEMPLATE_VERSION: return action.latestTemplateVersion;
    default: return state;
  }
};

const fetchingLatestTemplateVersion = (state = false, action) => {
  switch (action.type) {
    case UPDATE_FETCHING_LATEST_TEMPLATE_VERSION: return action.fetchingLatestTemplateVersion;
    default: return state;
  }
};


export default combineReducers({
  isDarkMode,
  isFullScreen,
  latestTemplateVersion,
  fetchingLatestTemplateVersion,
});
