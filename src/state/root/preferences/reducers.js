import { PREFERENCES_SET } from '../../../constants/actions';

import { getPreferences } from '../../../senders/preferences';

const initialState = getPreferences();

const screen = (state = initialState, action) => {
  switch (action.type) {
    case PREFERENCES_SET: {
      const newState = { ...state };
      newState[action.name] = action.value;

      return newState;
    }
    default:
      return state;
  }
};

export default screen;
