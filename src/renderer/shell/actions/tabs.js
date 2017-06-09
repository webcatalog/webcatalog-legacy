import {
  ADD_TAB,
  CLOSE_TAB,
  SET_ACTIVE_TAB,
  SET_TAB_LAST_URL,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const closeTab = tabId => ({
  type: CLOSE_TAB,
  tabId,
});

export const setActiveTab = tabId => ({
  type: SET_ACTIVE_TAB,
  tabId,
});

export const setTabLastURL = (tabId, lastUrl) => ({
  type: SET_TAB_LAST_URL,
  tabId,
  lastUrl,
});
