import { combineReducers } from 'redux';

import {
  APP_BAR_CHANGE_TAB,
} from '../../../constants/actions';

const tab = (state = 0, action) => {
  switch (action.type) {
    case APP_BAR_CHANGE_TAB: return action.tab;
    default: return state;
  }
};

export default combineReducers({ tab });
