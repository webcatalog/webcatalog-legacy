import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_POST_REQUEST,
  USER_POST_SUCCESS,
  USER_PATCH_REQUEST,
  USER_PATCH_SUCCESS,
} from '../../constants/actions';

export const userGetRequest = () => ({
  type: USER_GET_REQUEST,
});

export const userGetSuccess = res => ({
  type: USER_GET_SUCCESS,
  res,
});

export const userPostRequest = () => ({
  type: USER_POST_REQUEST,
});

export const userPostSuccess = () => ({
  type: USER_POST_SUCCESS,
});

export const userPatchRequest = () => ({
  type: USER_PATCH_REQUEST,
});

export const userPatchSuccess = () => ({
  type: USER_PATCH_SUCCESS,
});
