import { combineReducers } from 'redux';

import {
  SEARCH_OPEN,
  SEARCH_CLOSE,
  SEARCH_RESULTS_GET_REQUEST,
  SEARCH_RESULTS_GET_SUCCESS,
  SEARCH_FORM_UPDATE,
} from '../../constants/actions';

const initialForm = {
  query: '',
  results: [],
};

const form = (state = initialForm, action) => {
  switch (action.type) {
    case SEARCH_CLOSE: return initialForm;
    case SEARCH_FORM_UPDATE: {
      const { changes } = action;
      return Object.assign({}, state, changes);
    }
    default: return state;
  }
};

const isGetting = (state = false, action) => {
  switch (action.type) {
    case SEARCH_OPEN: return false;
    case SEARCH_RESULTS_GET_REQUEST: return true;
    case SEARCH_RESULTS_GET_SUCCESS: return false;
    case SEARCH_FORM_UPDATE: return false;
    default: return state;
  }
};

const results = (state = [], action) => {
  switch (action.type) {
    case SEARCH_OPEN: return [];
    case SEARCH_RESULTS_GET_REQUEST: return [];
    case SEARCH_RESULTS_GET_SUCCESS: return action.res.hits;
    case SEARCH_FORM_UPDATE: return [];
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case SEARCH_CLOSE: return false;
    case SEARCH_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({
  form,
  results,
  isGetting,
  open,
});
