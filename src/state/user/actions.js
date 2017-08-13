import { openSnackbar } from '../snackbar/actions';

import {
  userGetRequest,
  userGetSuccess,
  userPostRequest,
  userPostSuccess,
  userPatchRequest,
  userPatchSuccess,
  userPatchPasswordRequest,
  userPatchPasswordSuccess,
} from './action-creators';
import {
  apiGet,
  apiPost,
  apiPatch,
} from '../api';

export const getUser = () =>
  (dispatch) => {
    dispatch(userGetRequest());
    return dispatch(apiGet('/user'))
      .then(res => res.json())
      .then(res => dispatch(userGetSuccess({ ...res.user })))
      .catch(() => dispatch(openSnackbar('WebCatalog failed to get your profile information.')));
  };

export const postUser = () =>
  (dispatch) => {
    dispatch(userPostRequest());
    return dispatch(apiPost('/user', {}))
      .then(res => res.json())
      .then(res => dispatch(userPostSuccess(res)))
      .catch(() => dispatch(openSnackbar('WebCatalog failed to create your account.')));
  };

export const patchUser = changes =>
  (dispatch) => {
    dispatch(userPatchRequest());
    return dispatch(apiPatch('/user', changes))
      .then(res => res.json())
      .then(() => {
        dispatch(userPatchSuccess());
        dispatch(openSnackbar('Your profile has been saved!'));
        dispatch(getUser());
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your profile information.')));
  };

export const patchUserPassword = changes =>
  (dispatch) => {
    dispatch(userPatchPasswordRequest());
    return dispatch(apiPatch('/user/password', changes))
      .then(res => res.json())
      .then(() => {
        dispatch(userPatchPasswordSuccess());
        dispatch(openSnackbar('Your password has been updated!'));
      })
      .catch(() => dispatch(openSnackbar('WebCatalog failed to update your password.')));
  };

export default {
  getUser,
  postUser,
  patchUser,
};
