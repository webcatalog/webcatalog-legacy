import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from './dialogs/reducers';
import pages from './pages/reducers';

import local from './root/local/reducers';
import preferences from './root/preferences/reducers';
import router from './root/router/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';
import version from './root/version/reducers';

const rootReducer = combineReducers({
  dialogs,
  local,
  preferences,
  pages,
  router,
  snackbar,
  updater,
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
