import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth';
import core from './core';
import dialogs from './dialogs';
import home from './home';
import snackbar from './snackbar';
import updater from './updater';

const rootReducer = combineReducers({
  auth,
  core,
  dialogs,
  home,
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
