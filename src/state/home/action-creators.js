import {
  HOME_GET_FAILED,
  HOME_GET_REQUEST,
  HOME_GET_SUCCESS,
  HOME_RESET,
  HOME_UPDATE_CURRENT_QUERY,
  HOME_UPDATE_QUERY,
} from '../../constants/actions';

export const homeReset = () => ({
  type: HOME_RESET,
});

export const homeGetRequest = () => ({
  type: HOME_GET_REQUEST,
});

export const homeGetSuccess = params => ({
  type: HOME_GET_SUCCESS,
  ...params,
});

export const homeGetFailed = () => ({
  type: HOME_GET_FAILED,
});

export const homeUpdateCurrentQuery = currentQuery => ({
  type: HOME_UPDATE_CURRENT_QUERY,
  currentQuery,
});


export const homeUpdateQuery = query => ({
  type: HOME_UPDATE_QUERY,
  query,
});
