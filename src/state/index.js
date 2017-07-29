import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth/reducers';
import ui from './ui/reducers';
import updater from '../reducers/updater';
import core from '../reducers/core';
import user from './user/reducers';
import apps from './apps/reducers';

const rootReducer = combineReducers({
  auth,
  ui,
  updater,
  core,
  user,
  apps,
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
