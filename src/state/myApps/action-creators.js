import {
  USER_APPS_GET_REQUEST,
  USER_APPS_GET_SUCCESS,
} from '../../constants/actions';

export const userAppsGetRequest = () => ({
  type: USER_APPS_GET_REQUEST,
});

export const userAppsGetSuccess = res => ({
  type: USER_APPS_GET_SUCCESS,
  res,
});
