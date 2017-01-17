import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import app from './app';
import search from './search';

const rootReducer = combineReducers({
  app,
  search,
  routing: routerReducer,
});

export default rootReducer;
