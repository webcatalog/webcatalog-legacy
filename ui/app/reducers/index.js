import { combineReducers } from 'redux';

import nav from './nav';
import settings from './settings';
import findInPage from './findInPage';
import screen from './screen';

const rootReducer = combineReducers({
  nav,
  settings,
  findInPage,
  screen,
});

export default rootReducer;
