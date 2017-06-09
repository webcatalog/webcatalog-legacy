import {
  ADD_TAB,
  CLOSE_TAB,
  UPDATE_ACTIVE_TAB,
  UPDATE_TAB_LAST_URL,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const closeTab = tabId => ({
  type: CLOSE_TAB,
  tabId,
});

export const updateActiveTab = tabId => ({
  type: UPDATE_ACTIVE_TAB,
  tabId,
});

export const updateTabLastURL = (tabId, lastUrl) => ({
  type: UPDATE_TAB_LAST_URL,
  tabId,
  lastUrl,
});

export const updateCanGoBack = (tabId, canGoBack) => ({
  type: UPDATE_CAN_GO_BACK,
  tabId,
  canGoBack,
});

export const updateCanGoForward = (tabId, canGoForward) => ({
  type: UPDATE_CAN_GO_FORWARD,
  tabId,
  canGoForward,
});
