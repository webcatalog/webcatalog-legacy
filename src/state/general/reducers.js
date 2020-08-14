import { combineReducers } from 'redux';

import {
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
  UPDATE_INSTALLATION_PROGRESS,
} from '../../constants/actions';

import {
  getShouldUseDarkColors,
} from '../../senders';

const isFullScreen = (state = window.remote.getCurrentWindow().isFullScreen(), action) => {
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

const installationProgress = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_INSTALLATION_PROGRESS: return {
      percent: action.progress.percent || 0,
      desc: action.progress.desc || null,
    };
    default: return state;
  }
};

export default combineReducers({
  shouldUseDarkColors,
  isFullScreen,
  latestTemplateVersion,
  fetchingLatestTemplateVersion,
  movingAllApps,
  installationProgress,
});
