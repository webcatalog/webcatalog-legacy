import {
  userGetRequest,
  userGetSuccess,
  userPostRequest,
  userPostSuccess,
  userPatchRequest,
  userPatchSuccess,
} from './action-creators';
import {
  httpGet,
  httpPost,
  httpPatch,
} from '../../utils/http-json';

export const getUser = () =>
  (dispatch) => {
    dispatch(userGetRequest());
    return httpGet('/user')
      .then(res => dispatch(userGetSuccess(res)));
  };

export const postUser = () =>
  (dispatch) => {
    dispatch(userPostRequest());
    return httpPost('/user', {})
      .then(res => dispatch(userPostSuccess(res)));
  };

export const patchUser = () =>
  (dispatch) => {
    dispatch(userPatchRequest());
    return httpPatch('/user', {})
      .then(res => dispatch(userPatchSuccess(res)));
  };

export default {
  getUser,
  postUser,
  patchUser,
};
