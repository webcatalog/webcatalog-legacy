import {
  DIRECTORY_GET_FAILED,
  DIRECTORY_GET_REQUEST,
  DIRECTORY_GET_SUCCESS,
  DIRECTORY_RESET,
  DIRECTORY_UPDATE_CURRENT_QUERY,
  DIRECTORY_UPDATE_QUERY,
} from '../../../constants/actions';

export const directoryReset = () => ({
  type: DIRECTORY_RESET,
});

export const directoryGetRequest = () => ({
  type: DIRECTORY_GET_REQUEST,
});

export const directoryGetSuccess = params => ({
  type: DIRECTORY_GET_SUCCESS,
  ...params,
});

export const directoryGetFailed = () => ({
  type: DIRECTORY_GET_FAILED,
});

export const directoryUpdateCurrentQuery = currentQuery => ({
  type: DIRECTORY_UPDATE_CURRENT_QUERY,
  currentQuery,
});


export const directoryUpdateQuery = query => ({
  type: DIRECTORY_UPDATE_QUERY,
  query,
});
