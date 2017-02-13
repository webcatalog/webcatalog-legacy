import { combineReducers } from 'redux';

import nav from './nav';
import settings from './settings';
import findInPage from './findInPage';

const rootReducer = combineReducers({
  nav,
  settings,
  findInPage,
});

export default rootReducer;
