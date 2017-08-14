import { combineReducers } from 'redux';

import basic from './basic/reducers';
import advanced from './advanced/reducers';

import { SECTIONS } from './constants';

import {
  DIALOG_SETTINGS_CLOSE,
  DIALOG_SETTINGS_OPEN,
  DIALOG_SETTINGS_SECTION_CHANGE,
} from '../../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_SETTINGS_CLOSE: return false;
    case DIALOG_SETTINGS_OPEN: return true;
    default: return state;
  }
};

const sectionInitialState = SECTIONS.BASIC;
const section = (state = sectionInitialState, action) => {
  switch (action.type) {
    case DIALOG_SETTINGS_CLOSE: return sectionInitialState;
    case DIALOG_SETTINGS_SECTION_CHANGE: return action.section;
    default: return state;
  }
};

export default combineReducers({
  open,
  section,
  basic,
  advanced,
});
