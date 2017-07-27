import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth/reducers';
import home from './home/reducers';
import ui from './ui/reducers';
import updater from '../reducers/updater';
import core from '../reducers/core';
import user from './user/reducers';

const rootReducer = combineReducers({
  auth,
  home,
  ui,
  updater,
  core,
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
