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
import version from './root/version/reducers';

const rootReducer = combineReducers({
  auth,
  dialogs,
  local,
  pages,
  router,
  snackbar,
  updater,
  user,
  version,
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
