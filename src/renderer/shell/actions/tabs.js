import {
  ADD_TAB,
  SET_ACTIVE_TAB,
  SET_TAB_LAST_URL,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const setActiveTab = isActive => ({
  type: SET_ACTIVE_TAB,
  isActive,
});

export const setTabLastURL = (tabIndex, lastUrl) => ({
  type: SET_TAB_LAST_URL,
  tabIndex,
  lastUrl,
});
