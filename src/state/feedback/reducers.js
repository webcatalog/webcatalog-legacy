import { combineReducers } from 'redux';

import {
  FEEDBACK_POST_REQUEST,
  FEEDBACK_POST_SUCCESS,
} from '../../constants/actions';

const isPosting = (state = false, action) => {
  switch (action.type) {
    case FEEDBACK_POST_REQUEST: return true;
    case FEEDBACK_POST_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({ isPosting });
