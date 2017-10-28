import semver from 'semver';
import { SET_UPDATER_STATUS } from '../../../constants/actions';
import {
  CHECKING_FOR_UPDATES,
  UPDATE_AVAILABLE,
  UPDATE_ERROR,
  UPDATE_NOT_AVAILABLE,
} from '../../../constants/updater-statuses';

export const setUpdaterStatus = (status, data) => ({
  type: SET_UPDATER_STATUS,
  status,
  data,
});

export const checkForLinuxUpdates = () =>
  (dispatch) => {
    if (window.platform !== 'linux') {
      return null;
    }

    dispatch(setUpdaterStatus(CHECKING_FOR_UPDATES));

    return window.fetch('https://api.github.com/repos/webcatalog/webcatalog/releases/latest')
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      })
      .then(response => response.json())
      .then(({ tag_name }) => {
        const latestVersion = tag_name.substring(1);

        if (semver.gte(window.version, latestVersion)) {
          dispatch(setUpdaterStatus(UPDATE_NOT_AVAILABLE));
          return;
        }

        dispatch(setUpdaterStatus(UPDATE_AVAILABLE, { version: latestVersion }));
      })
      .catch(() => {
        dispatch(setUpdaterStatus(UPDATE_ERROR));
      });
  };
