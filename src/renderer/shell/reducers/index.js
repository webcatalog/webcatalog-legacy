import { combineReducers } from 'redux';

import nav from './nav';
import settings from './settings';
import findInPage from './findInPage';
import screen from './screen';
import tabs from './tabs';

const rootReducer = combineReducers({
  nav,
  settings,
  findInPage,
  screen,
  tabs,
});

export default rootReducer;
