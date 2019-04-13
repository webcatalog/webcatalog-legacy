import {
  UPDATE_IS_DARK_MODE,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_LATEST_TEMPLATE_VERSION,
  UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  UPDATE_MOVING_ALL_APPS,
} from '../../constants/actions';

export const updateIsFullScreen = isFullScreen => ({
  type: UPDATE_IS_FULL_SCREEN,
  isFullScreen,
});

export const updateIsDarkMode = isDarkMode => ({
  type: UPDATE_IS_DARK_MODE,
  isDarkMode,
});

export const updateLatestTemplateVersion = latestTemplateVersion => ({
  type: UPDATE_LATEST_TEMPLATE_VERSION,
  latestTemplateVersion,
});

export const updateFetchingLatestTemplateVersion = fetchingLatestTemplateVersion => ({
  type: UPDATE_FETCHING_LATEST_TEMPLATE_VERSION,
  fetchingLatestTemplateVersion,
});

export const updateMovingAllApps = movingAllApps => ({
  type: UPDATE_MOVING_ALL_APPS,
  movingAllApps,
});

export const fetchLatestTemplateVersionAsync = () => (dispatch) => {
  dispatch(updateFetchingLatestTemplateVersion(true));
  return Promise.resolve()
    .then(() => new Promise(resolve => setTimeout(resolve, 5 * 1000)))
    .then(() => fetch('https://api.github.com/repos/quanglam2807/webcatalog/releases/latest'))
    .then(res => res.json())
    .then((release) => {
      const v = release.tag_name;
      return fetch(`https://raw.githubusercontent.com/quanglam2807/webcatalog/${v}/package.json`);
    })
    .then(res => res.json())
    .then((fetchedJson) => {
      dispatch(updateLatestTemplateVersion(fetchedJson.templateVersion));
      dispatch(updateFetchingLatestTemplateVersion(false));
    })
    .catch((err) => {
      dispatch(updateFetchingLatestTemplateVersion(false));
      console.log(err);
    });
};
