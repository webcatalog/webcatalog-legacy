import {
  userGetRequest,
  userGetSuccess,
  userPostRequest,
  userPostSuccess,
  userPatchRequest,
  userPatchSuccess,
} from './action-creators';
import {
  apiGet,
  apiPost,
  apiPatch,
} from '../../actions/api';

export const getUser = () =>
  (dispatch) => {
    dispatch(userGetRequest());
    return apiGet('/user')
      .then(res => dispatch(userGetSuccess(res)));
  };

export const postUser = () =>
  (dispatch) => {
    dispatch(userPostRequest());
    return apiPost('/user', {})
      .then(res => dispatch(userPostSuccess(res)));
  };

export const patchUser = () =>
  (dispatch) => {
    dispatch(userPatchRequest());
    return apiPatch('/user', {})
      .then(res => dispatch(userPatchSuccess(res)));
  };

export default {
  getUser,
  postUser,
  patchUser,
};
