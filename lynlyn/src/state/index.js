import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from '../state/dialogs/reducers';
import directory from '../state/root/directory/reducers';
import findInPage from './root/find-in-page/reducers';
import general from './root/general/reducers';
import locker from './root/locker/reducers';
import preferences from './root/preferences/reducers';
import screen from './root/screen/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';
import workspaces from './root/workspaces/reducers';

const rootReducer = combineReducers({
  dialogs,
  directory,
  findInPage,
  general,
  locker,
  preferences,
  root,
  screen,
  snackbar,
  updater,
  workspaces,
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
