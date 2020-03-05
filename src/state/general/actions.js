import semver from 'semver';

import {
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_THEME_SOURCE,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
} from '../../constants/actions';

const { remote } = window.require('electron');

export const updateIsFullScreen = (isFullScreen) => ({
  type: UPDATE_IS_FULL_SCREEN,
  isFullScreen,
});

export const updateShouldUseDarkColors = (shouldUseDarkColors) => ({
  type: UPDATE_SHOULD_USE_DARK_COLORS,
  shouldUseDarkColors,
});

export const updateThemeSource = (themeSource) => ({
  type: UPDATE_THEME_SOURCE,
  themeSource,
});

export const updateLatestTemplateVersion = (latestTemplateVersion) => ({
  type: UPDATE_LATEST_TEMPLATE_VERSION,
  latestTemplateVersion,
});

export const updateFetchingLatestTemplateVersion = (fetchingLatestTemplateVersion) => ({
  type: UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  fetchingLatestTemplateVersion,
});

export const updateMovingAllApps = (movingAllApps) => ({
  type: UPDATE_MOVING_ALL_APPS,
  movingAllApps,
});

export const fetchLatestTemplateVersionAsync = () => (dispatch) => {
  dispatch(updateFetchingLatestTemplateVersion(true));
  return Promise.resolve()
    .then(() => new Promise((resolve) => setTimeout(resolve, 5 * 1000)))
    .then(() => window.fetch('https://api.github.com/repos/quanglam2807/webcatalog/releases/latest'))
    .then((res) => res.json())
    .then((release) => {
      const v = release.tag_name;
      return window.fetch(`https://raw.githubusercontent.com/quanglam2807/webcatalog/${v}/package.json`);
    })
    .then((res) => res.json())
    .then((fetchedJson) => {
      const globalTemplateVersion = remote.getGlobal('templateVersion');
      if (globalTemplateVersion && semver.lt(fetchedJson.templateVersion, globalTemplateVersion)) {
        dispatch(updateLatestTemplateVersion(globalTemplateVersion));
      } else {
        dispatch(updateLatestTemplateVersion(fetchedJson.templateVersion));
      }
      dispatch(updateFetchingLatestTemplateVersion(false));
    })
    .catch((err) => {
      const globalTemplateVersion = remote.getGlobal('templateVersion');
      if (globalTemplateVersion) {
        dispatch(updateLatestTemplateVersion(globalTemplateVersion));
      }
      dispatch(updateFetchingLatestTemplateVersion(false));
      console.log(err); // eslint-disable-line no-console
    });
};
