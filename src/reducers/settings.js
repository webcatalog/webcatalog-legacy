import {
  TOGGLE_SETTING_DIALOG,
} from '../constants/actions';

const initialState = {
  isOpen: false,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SETTING_DIALOG: {
      return Object.assign({}, state, {
        isOpen: !state.isOpen,
      });
    }
    default:
      return state;
  }
};

export default app;
