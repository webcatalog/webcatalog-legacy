import { combineReducers } from 'redux';

import {
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_THEME_SOURCE,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
} from '../../constants/actions';

import {
  getThemeSource,
  getShouldUseDarkColors,
} from '../../senders';

const { remote } = window.require('electron');

const isFullScreen = (state = remote.getCurrentWindow().isFullScreen(), action) => {
  switch (action.type) {
    case UPDATE_IS_FULL_SCREEN: return action.isFullScreen;
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

const movingAllApps = (state = false, action) => {
  switch (action.type) {
    case UPDATE_MOVING_ALL_APPS: return action.movingAllApps;
    default: return state;
  }
};

export default combineReducers({
  shouldUseDarkColors,
  themeSource,
  isFullScreen,
  latestTemplateVersion,
  fetchingLatestTemplateVersion,
  movingAllApps,
});
