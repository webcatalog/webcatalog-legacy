import {
  SET_FOCUSED,
  UPDATE_CURRENT_URL,
  UPDATE_SEARCH_QUERY,
} from '../../../constants/actions';


import {
  getHomePath,
} from '../../../senders/generic';

const initialState = {
  query: '',
  focused: false,
};

const homePath = `file://${getHomePath()}`;

const screen = (state = initialState, action) => {
  switch (action.type) {
    case SET_FOCUSED:
      return Object.assign({}, state, {
        focused: action.focused,
      });
    case UPDATE_CURRENT_URL:
      return Object.assign({}, state, {
        query: action.currentUrl === homePath ? '' : action.currentUrl,
      });
    case UPDATE_SEARCH_QUERY:
      return Object.assign({}, state, {
        query: action.query,
      });
    default:
      return state;
  }
};

export default screen;
