import {
  versionGetRequest,
  // versionGetSuccess,
  // versionGetFailed,
} from './action-creators';

export const getVersion = () =>
  (dispatch) => {
    dispatch(versionGetRequest());
    /*
    return fetch(`https://raw.githubusercontent.com/webcatalog/webcatalog/v${window.version}/package.json`)
      .then(res => res.json())
      .then(res => dispatch(versionGetSuccess(res)))
      .catch(() => dispatch(versionGetFailed()));
    */
  };
