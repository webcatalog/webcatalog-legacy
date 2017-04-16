import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import appManagement from './appManagement';
import home from './home';
import search from './search';
import installed from './installed';
import screen from './screen';

const rootReducer = combineReducers({
  appManagement,
  home,
  search,
  installed,
  screen,
  routing: routerReducer,
});

export default rootReducer;
