import {
  ADD_TAB,
  SET_ACTIVE_TAB,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const setActiveTab = isActive => ({
  type: SET_ACTIVE_TAB,
  isActive,
});
