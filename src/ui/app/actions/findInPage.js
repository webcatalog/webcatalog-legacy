import { TOGGLE_FIND_IN_PAGE_DIALOG, UPDATE_FIND_IN_PAGE_TEXT, UPDATE_FIND_IN_PAGE_MATCHES } from '../constants/actions';

export const toggleFindInPageDialog = () => ({
  type: TOGGLE_FIND_IN_PAGE_DIALOG,
});

export const updateFindInPageText = text => ({
  type: UPDATE_FIND_IN_PAGE_TEXT,
  text,
});

export const updateFindInPageMatches = (activeMatch, matches) => ({
  type: UPDATE_FIND_IN_PAGE_MATCHES,
  activeMatch,
  matches,
});
