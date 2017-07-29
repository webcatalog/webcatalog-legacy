import {
  APPS_DETAILS_GET_REQUEST,
  APPS_DETAILS_GET_SUCCESS,
} from '../../../constants/actions';

export const appsDetailsGetRequest = () => ({
  type: APPS_DETAILS_GET_REQUEST,
});

export const appsDetailsGetSuccess = res => ({
  type: APPS_DETAILS_GET_SUCCESS,
  res,
});
