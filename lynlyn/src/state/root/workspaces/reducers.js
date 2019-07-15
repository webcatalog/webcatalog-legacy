import {
  WORKSPACES_ADD,
  WORKSPACES_SET,
  WORKSPACES_REMOVE,
} from '../../../constants/actions';

import { getWorkspaces } from '../../../senders/workspaces';

const initialState = getWorkspaces();

const workspaces = (state = initialState, action) => {
  switch (action.type) {
    case WORKSPACES_ADD: {
      const newState = state.slice();
      newState.push(action.value);

      return newState;
    }
    case WORKSPACES_SET: {
      const newState = state.slice();
      newState[action.index] = action.value;

      return newState;
    }
    case WORKSPACES_REMOVE: {
      const newState = state.slice();
      newState.splice(action.index, 1);

      return newState;
    }
    default:
      return state;
  }
};

export default workspaces;
