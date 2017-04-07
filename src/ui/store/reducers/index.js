import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import appManagement from './appManagement';
import home from './home';
import search from './search';
import installed from './installed';

const rootReducer = combineReducers({
  appManagement,
  home,
  search,
  installed,
  routing: routerReducer,
});

export default rootReducer;
