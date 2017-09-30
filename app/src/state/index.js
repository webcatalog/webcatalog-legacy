import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './root/auth/reducers';
import dialogs from '../state/dialogs/reducers';
import findInPage from './root/find-in-page/reducers';
import nav from './root/nav/reducers';
import preferences from './root/preferences/reducers';
import screen from './root/screen/reducers';
import snackbar from './root/snackbar/reducers';
import user from './root/user/reducers';
import version from './root/version/reducers';

const rootReducer = combineReducers({
  auth,
  dialogs,
  findInPage,
  nav,
  preferences,
  root,
  screen,
  snackbar,
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
