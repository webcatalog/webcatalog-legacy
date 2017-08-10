import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth/reducers';
import dialogs from './dialogs/reducers';
import local from './local/reducers';
import myApps from './myApps/reducers';
import routes from './routes/reducers';
import search from './search/reducers';
import snackbar from './snackbar/reducers';
import topCharts from './topCharts/reducers';
import updater from './updater/reducers';
import user from './user/reducers';

const rootReducer = combineReducers({
  auth,
  dialogs,
  local,
  myApps,
  routes,
  search,
  snackbar,
  topCharts,
  updater,
  user,
});

const configureStore = initialState =>
  createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

// init store
const store = configureStore();

export default store;
