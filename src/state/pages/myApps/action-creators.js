import {
  MY_APPS_GET_FAILED,
  MY_APPS_GET_REQUEST,
  MY_APPS_GET_SUCCESS,
  MY_APPS_RESET,
} from '../../../constants/actions';

export const myAppsReset = () => ({
  type: MY_APPS_RESET,
});

export const myAppsGetFailed = res => ({
  type: MY_APPS_GET_FAILED,
  res,
});

export const myAppsGetRequest = () => ({
  type: MY_APPS_GET_REQUEST,
});

export const myAppsGetSuccess = res => ({
  type: MY_APPS_GET_SUCCESS,
  res,
});
