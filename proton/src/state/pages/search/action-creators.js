import {
  SEARCH_FORM_UPDATE,
  SEARCH_RESULTS_GET_FAILED,
  SEARCH_RESULTS_GET_REQUEST,
  SEARCH_RESULTS_GET_SUCCESS,
} from '../../../constants/actions';

export const searchResultsGetRequest = () => ({
  type: SEARCH_RESULTS_GET_REQUEST,
});

export const searchResultsGetSuccess = res => ({
  type: SEARCH_RESULTS_GET_SUCCESS,
  res,
});

export const searchResultsGetFailed = res => ({
  type: SEARCH_RESULTS_GET_FAILED,
  res,
});

export const searchFormUpdate = changes => ({
  type: SEARCH_FORM_UPDATE,
  changes,
});
