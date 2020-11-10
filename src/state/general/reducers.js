/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_INSTALLATION_PROGRESS,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_MAXIMIZED,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
  UPDATE_SHOULD_USE_DARK_COLORS,
} from '../../constants/actions';

import {
  getShouldUseDarkColors,
} from '../../senders';

const win = window.remote.getCurrentWindow();

const isMaximized = (state = win.isMaximized(), action) => {
  switch (action.type) {
    case UPDATE_IS_MAXIMIZED: return action.isMaximized;
    default: return state;
  }
};

const isFullScreen = (state = win.isFullScreen(), action) => {
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
  fetchingLatestTemplateVersion,
  installationProgress,
  isFullScreen,
  isMaximized,
  latestTemplateVersion,
  movingAllApps,
  shouldUseDarkColors,
});
