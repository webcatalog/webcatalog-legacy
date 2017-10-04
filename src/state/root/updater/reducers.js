import { combineReducers } from 'redux';

import { SET_UPDATER_STATUS } from '../../../constants/actions';
import { UPDATE_NOT_AVAILABLE } from '../../../constants/updater-statuses';

const status = (state = UPDATE_NOT_AVAILABLE, action) => {
  switch (action.type) {
    case SET_UPDATER_STATUS: return action.status;
    default: return state;
  }
};

const data = (state = {}, action) => {
  if (action.data && typeof action.data === 'object') return action.data;
  return state;
};


export default combineReducers({
  data,
  status,
});
