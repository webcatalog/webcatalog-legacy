import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
  USER_GET_FAILED,
} from '../../../constants/actions';

export const userGetRequest = () => ({
  type: USER_GET_REQUEST,
});

export const userGetSuccess = res => ({
  type: USER_GET_SUCCESS,
  res,
});

export const userGetFailed = () => ({
  type: USER_GET_FAILED,
});
