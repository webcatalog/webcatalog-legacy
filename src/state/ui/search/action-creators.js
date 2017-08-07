import {
  SEARCH_CLOSE,
  SEARCH_OPEN,
  SEARCH_FORM_UPDATE,
  SEARCH_RESULTS_GET_REQUEST,
  SEARCH_RESULTS_GET_SUCCESS,
} from '../../../constants/actions';

export const searchOpen = () => ({
  type: SEARCH_OPEN,
});

export const searchClose = () => ({
  type: SEARCH_CLOSE,
});

export const searchResultsGetRequest = () => ({
  type: SEARCH_RESULTS_GET_REQUEST,
});

export const searchResultsGetSuccess = res => ({
  type: SEARCH_RESULTS_GET_SUCCESS,
  res,
});

export const searchFormUpdate = changes => ({
  type: SEARCH_FORM_UPDATE,
  changes,
});
