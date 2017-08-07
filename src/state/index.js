import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import apps from './apps/reducers';
import auth from './auth/reducers';
import local from './local/reducers';
import ui from './ui/reducers';
import updater from './updater/reducers';
import user from './user/reducers';

const rootReducer = combineReducers({
  apps,
  auth,
  local,
  ui,
  updater,
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
