import {
  ADD_TAB,
  REMOVE_TAB,
  SET_ACTIVE_TAB,
  SWAP_TAB,
} from '../constants/actions';

export const addTab = () => ({
  type: ADD_TAB,
});

export const removeTab = id => ({
  type: REMOVE_TAB,
  id,
});

export const swapTab = (firstIndex, secondIndex) => ({
  type: SWAP_TAB,
  firstIndex,
  secondIndex,
});

export const setActiveTab = id => ({
  type: SET_ACTIVE_TAB,
  id,
});
