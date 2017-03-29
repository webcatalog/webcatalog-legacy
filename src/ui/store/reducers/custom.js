import Immutable from 'immutable';

import { TOGGLE_CUSTOM_DIALOG, SET_CUSTOM_VALUE, SET_CUSTOM_STATUS } from '../constants/actions';
import { DEFAULT } from '../constants/statuses';

const initialState = Immutable.Map({
  isOpen: false,
  status: DEFAULT,
  name: '',
  url: '',
  id: null,
  icon: null,
});


const custom = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CUSTOM_DIALOG: {
      return state.set('isOpen', !state.get('isOpen'));
    }
    case SET_CUSTOM_VALUE: {
      return state.set(action.fieldName, action.fieldVal);
    }
    case SET_CUSTOM_STATUS: {
      return state.set('status', action.status);
    }
    default:
      return state;
  }
};

export default custom;
