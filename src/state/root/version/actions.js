import {
  versionGetRequest,
  versionGetSuccess,
  versionGetFailed,
} from './action-creators';

export const getVersion = () =>
  (dispatch) => {
    dispatch(versionGetRequest());
    return fetch('https://webcatalog.io/api/version/latest')
      .then(res => res.json())
      .then(res => dispatch(versionGetSuccess(res)))
      .catch(() => dispatch(versionGetFailed()));
  };
