import { combineReducers } from 'redux';

import {
  BROWSER_INSTALLLED_CHANGE,
} from '../../../constants/actions';

const browserInstalled = (state = false, action) => {
  switch (action.type) {
    case BROWSER_INSTALLLED_CHANGE: return action.browserInstalled;
    default: return state;
  }
};

export default combineReducers({
  browserInstalled,
});
