import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app';
import search from './search';
import installed from './installed';
import custom from './custom';

const rootReducer = combineReducers({
  app,
  search,
  installed,
  custom,
  routing: routerReducer,
});

export default rootReducer;
