import Immutable from 'immutable';
import { remote } from 'electron';
import { SIGN_IN, LOG_OUT } from '../constants/actions';

const electronSettings = remote.require('electron-settings');

const initialState = Immutable.Map({
  token: electronSettings.get('token', null),
});

const auth = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      electronSettings.set('token', action.token);
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
