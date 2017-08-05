import {
  CLOSE_SEARCH_BOX,
  OPEN_SEARCH_BOX,
  SEARCH_FORM_UPDATE,
  SEARCH_RESULTS_GET_REQUEST,
  SEARCH_RESULTS_GET_SUCCESS,
} from '../../../constants/actions';

export const searchBoxOpen = () => ({
  type: OPEN_SEARCH_BOX,
});

export const searchBoxClose = () => ({
  type: CLOSE_SEARCH_BOX,
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
