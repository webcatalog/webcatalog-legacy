import {
  VERSION_GET_REQUEST,
  VERSION_GET_SUCCESS,
  VERSION_GET_FAILED,
} from '../../../constants/actions';

export const versionGetRequest = () => ({
  type: VERSION_GET_REQUEST,
});

export const versionGetSuccess = res => ({
  type: VERSION_GET_SUCCESS,
  res,
});

export const versionGetFailed = () => ({
  type: VERSION_GET_FAILED,
});
