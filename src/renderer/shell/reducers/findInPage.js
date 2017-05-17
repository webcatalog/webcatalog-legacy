import Immutable from 'immutable';

import {
  TOGGLE_FIND_IN_PAGE_DIALOG, UPDATE_FIND_IN_PAGE_TEXT, UPDATE_FIND_IN_PAGE_MATCHES,
} from '../constants/actions';

const initialState = Immutable.Map({
  isOpen: false,
  text: '',
  activeMatch: 0,
  matches: 0,
});


const findInPage = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_FIND_IN_PAGE_DIALOG: {
      return state.set('isOpen', !state.get('isOpen'));
    }
    case UPDATE_FIND_IN_PAGE_TEXT: {
      return state.set('text', action.text);
    }
    case UPDATE_FIND_IN_PAGE_MATCHES: {
      return state.set('activeMatch', action.activeMatch).set('matches', action.matches);
    }
    default:
      return state;
  }
};

export default findInPage;
