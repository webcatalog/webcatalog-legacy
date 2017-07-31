import { combineReducers } from 'redux';

import {
  DRAFTS_POST_REQUEST,
  DRAFTS_POST_SUCCESS,
} from '../../constants/actions';

const isPosting = (state = false, action) => {
  switch (action.type) {
    case DRAFTS_POST_REQUEST: return true;
    case DRAFTS_POST_SUCCESS: return false;
    default: return state;
  }
};

export default combineReducers({ isPosting });
