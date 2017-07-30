import { combineReducers } from 'redux';

import password from './password/reducers';
import profile from './profile/reducers';

import { SECTIONS } from './constants';

import {
  DIALOG_ACCOUNT_CLOSE,
  DIALOG_ACCOUNT_OPEN,
  DIALOG_ACCOUNT_SECTION_CHANGE,
} from '../../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_CLOSE: return false;
    case DIALOG_ACCOUNT_OPEN: return true;
    default: return state;
  }
};

const sectionInitialState = SECTIONS.PROFILE;
const section = (state = sectionInitialState, action) => {
  switch (action.type) {
    case DIALOG_ACCOUNT_CLOSE: return sectionInitialState;
    case DIALOG_ACCOUNT_SECTION_CHANGE: return action.section;
    default: return state;
  }
};

export default combineReducers({
  open,
  section,
  password,
  profile,
});
