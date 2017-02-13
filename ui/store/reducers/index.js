import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app';
import search from './search';
import installed from './installed';

const rootReducer = combineReducers({
  app,
  search,
  installed,
  routing: routerReducer,
});

export default rootReducer;
