import { combineReducers } from 'redux';

import route from './route';
import screen from './screen';
import appManagement from './appManagement';
import home from './home';
import search from './search';
import installed from './installed';
import auth from './auth';
import myApps from './myApps';

const rootReducer = combineReducers({
  route,
  screen,
  appManagement,
  home,
  search,
  installed,
  auth,
  myApps,
});

export default rootReducer;
