import { combineReducers } from 'redux';

import {
  INSTALLED_UPDATE_QUERY,
} from '../../constants/actions';

const query = (state = '', action) => {
  switch (action.type) {
    case INSTALLED_UPDATE_QUERY: return action.query;
    default: return state;
  }
};

export default combineReducers({
  query,
});
