import {
  versionGetRequest,
  versionGetSuccess,
  versionGetFailed,
} from './action-creators';
import {
  apiGet,
} from '../../api';

export const getVersion = () =>
  (dispatch) => {
    dispatch(versionGetRequest());
    return dispatch(apiGet('/version/latest'))
      .then(res => dispatch(versionGetSuccess(res)))
      .catch(() => dispatch(versionGetFailed()));
  };
