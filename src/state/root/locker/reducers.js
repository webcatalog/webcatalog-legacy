import { combineReducers } from 'redux';

import {
  LOCKER_UNLOCK,
  LOCKER_LOCK,
  LOCKER_FORM_UPDATE,
} from '../../../constants/actions';

import { getPreference } from '../../../senders/preferences';

const unlocked = (state = Boolean(getPreference('lockApp') === null), action) => {
  switch (action.type) {
    case LOCKER_UNLOCK: return true;
    case LOCKER_LOCK: return false;
    default: return state;
  }
};

const defaultForm = {
  password: '',
  passwordErr: null,
};
const form = (state = defaultForm, action) => {
  switch (action.type) {
    case LOCKER_FORM_UPDATE: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({
  form,
  unlocked,
});
