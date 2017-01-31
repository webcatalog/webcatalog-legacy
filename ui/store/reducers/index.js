import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app';
import search from './search';
import installed from './installed';
import settings from './settings';

const rootReducer = combineReducers({
  app,
  search,
  installed,
  settings,
  routing: routerReducer,
});

export default rootReducer;
