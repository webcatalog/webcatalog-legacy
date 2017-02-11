import { combineReducers } from 'redux';

import nav from './nav';
import settings from './settings';

const rootReducer = combineReducers({
  nav,
  settings,
});

export default rootReducer;
