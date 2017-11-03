import { openSnackbar } from '../snackbar/actions';

import {
  userGetRequest,
  userGetSuccess,
  userGetFailed,
} from './action-creators';
import {
  apiGet,
} from '../../api';

export const getUser = () =>
  (dispatch) => {
    dispatch(userGetRequest());
    return dispatch(apiGet('/user'))
      .then((res) => {
        window.localStorage.setItem('user', JSON.stringify(res.user));
        dispatch(userGetSuccess(res.user));
      })
      .catch(() => {
        dispatch(userGetFailed());

        // try to get data from localStorage
        const localStorageUserStr = window.localStorage.getItem('user');
        if (localStorageUserStr) {
          const user = JSON.parse(localStorageUserStr);
          dispatch(userGetSuccess(user));
        } else {
          dispatch(openSnackbar('WebCatalog failed to get your profile information.'));
        }
      });
  };

export const removeUser = () =>
  (dispatch) => {
    window.localStorage.removeItem('user');
    dispatch(userGetSuccess({}));
  };
