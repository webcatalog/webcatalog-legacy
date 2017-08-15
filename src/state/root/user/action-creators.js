import {
  USER_GET_REQUEST,
  USER_GET_SUCCESS,
} from '../../../constants/actions';

export const userGetRequest = () => ({
  type: USER_GET_REQUEST,
});

export const userGetSuccess = res => ({
  type: USER_GET_SUCCESS,
  res,
});
