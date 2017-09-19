import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from './dialogs/reducers';
import pages from './pages/reducers';

import auth from './root/auth/reducers';
import local from './root/local/reducers';
import router from './root/router/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';
import user from './root/user/reducers';

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
