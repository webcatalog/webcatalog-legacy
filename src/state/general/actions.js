import semver from 'semver';
import xmlParser from 'fast-xml-parser';

import {
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
  UPDATE_INSTALLATION_PROGRESS,
} from '../../constants/actions';

export const updateIsFullScreen = (isFullScreen) => ({
  type: UPDATE_IS_FULL_SCREEN,
  isFullScreen,
});

export const updateShouldUseDarkColors = (shouldUseDarkColors) => ({
  type: UPDATE_SHOULD_USE_DARK_COLORS,
  shouldUseDarkColors,
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

export const updateInstallationProgress = (progress) => ({
  type: UPDATE_INSTALLATION_PROGRESS,
  progress,
});

export const fetchLatestTemplateVersionAsync = () => (dispatch, getState) => {
  const { allowPrerelease } = getState().preferences;
  const { remote } = window.require('electron');
  dispatch(updateFetchingLatestTemplateVersion(true));
  return Promise.resolve()
    .then(() => new Promise((resolve) => setTimeout(resolve, 5 * 1000)))
    // avoid using GitHub API as it has rate limit (60 requests per hour)
    .then(() => window.fetch('https://github.com/atomery/juli/releases.atom'))
    .then((res) => res.text())
    .then((xmlData) => {
      const releases = xmlParser.parse(xmlData).feed.entry;

      if (allowPrerelease) {
        // just return the first one
        const tagName = releases[0].id.split('/').pop();
        return tagName.substring(1);
      }

      // find stable version
      for (let i = 0; i < releases.length; i += 1) {
        const release = releases[i];
        // use id instead of title as it's computer-generated
        // avoid human mistake
        const tagName = release.id.split('/').pop();
        const version = tagName.substring(1);
        if (!semver.prerelease(version)) {
          return version;
        }
      }

      return Promise.reject(new Error('Server returns no valid updates.'));
    })
    .then((latestVersion) => {
      const globalTemplateVersion = remote.getGlobal('templateVersion');
      if (globalTemplateVersion && semver.lt(latestVersion, globalTemplateVersion)) {
        dispatch(updateLatestTemplateVersion(globalTemplateVersion));
      } else {
        dispatch(updateLatestTemplateVersion(latestVersion));
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
