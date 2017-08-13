import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from './dialogs/reducers';
import pages from './pages/reducers';

import auth from './main/auth/reducers';
import local from './main/local/reducers';
import router from './main/router/reducers';
import snackbar from './main/snackbar/reducers';
import updater from './main/updater/reducers';
import user from './main/user/reducers';

const rootReducer = combineReducers({
  auth,
  dialogs,
  local,
  router,
  snackbar,
  updater,
  user,
  pages,
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
