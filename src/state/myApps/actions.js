import {
  userAppsGetRequest,
  userAppsGetSuccess,
} from './action-creators';

import { apiGet } from '../api';

export const getUserApps = () =>
  (dispatch) => {
    dispatch(userAppsGetRequest());
    return dispatch(apiGet('/user/apps'))
      .then(res => res.json())
      .then(res => dispatch(userAppsGetSuccess({ ...res })));
  };
