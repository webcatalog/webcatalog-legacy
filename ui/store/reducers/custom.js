import {
  TOGGLE_CUSTOM_DIALOG, SET_CUSTOM_VALUE, SET_CUSTOM_STATUS, DEFAULT,
} from '../constants/actions';

const initialState = {
  isOpen: false,
  status: DEFAULT,
  name: '',
  url: '',
  id: null,
  icon: null,
};


const custom = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_CUSTOM_DIALOG: {
      return Object.assign({}, state, {
        isOpen: !state.isOpen,
      });
    }
    case SET_CUSTOM_VALUE: {
      const newState = Object.assign({}, state, {});
      newState[action.fieldName] = action.fieldVal;
      return newState;
    }
    case SET_CUSTOM_STATUS: {
      return Object.assign({}, state, {
        status: action.status,
      });
    }
    default:
      return state;
  }
};

export default custom;
