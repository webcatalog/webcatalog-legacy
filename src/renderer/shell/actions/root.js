import {
  ADD_TAB,
  REMOVE_TAB,
  SET_ACTIVE_TAB,
  // SET_TAB_LAST_URL,
  // SET_TAB_CAN_GO_BACK,
  // SET_TAB_CAN_GO_FORWARD,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const removeTab = id => ({
  type: REMOVE_TAB,
  id,
});

export const setActiveTab = id => ({
  type: SET_ACTIVE_TAB,
  id,
});
