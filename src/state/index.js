import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from '../state/dialogs/reducers';
import findInPage from './root/find-in-page/reducers';
import locker from './root/locker/reducers';
import nav from './root/nav/reducers';
import preferences from './root/preferences/reducers';
import screen from './root/screen/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';

const rootReducer = combineReducers({
  dialogs,
  findInPage,
  locker,
  nav,
  preferences,
  root,
  screen,
  snackbar,
  updater,
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
