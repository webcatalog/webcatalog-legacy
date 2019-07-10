import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from './dialogs/reducers';

import findInPage from './root/find-in-page/reducers';
import nav from './root/nav/reducers';
import screen from './root/screen/reducers';
import searchBox from './root/search-box/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';

const rootReducer = combineReducers({
  dialogs,
  findInPage,
  nav,
  screen,
  searchBox,
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
