import {
  UPDATE_SEARCH_QUERY,
  SET_FOCUSED,
} from '../../../constants/actions';

/* eslint-disable import/prefer-default-export */
export const updateQuery = query => ({
  type: UPDATE_SEARCH_QUERY,
  query,
});

export const setFocused = focused => ({
  type: SET_FOCUSED,
  focused,
});
