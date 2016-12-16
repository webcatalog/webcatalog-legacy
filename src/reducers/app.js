import {
  UPDATE_APP,
} from '../constants/actions';

const initialState = {
  status: 'loading',
  apps: null,
  currentPage: null,
  totalPage: null,
};

const app = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_APP:
      return Object.assign({}, state, {
        status: action.status,
        apps: action.apps,
      });
    default:
      return state;
  }
};

export default app;
