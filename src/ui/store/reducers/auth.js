import Immutable from 'immutable';

import { SIGN_IN, LOG_OUT } from '../constants/actions';

const initialState = Immutable.Map({
  token: null,
});

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return state
        .set('token', action.token);
    case LOG_OUT:
      return state
        .set('token', action.token);
    default:
      return state;
  }
};

export default auth;
