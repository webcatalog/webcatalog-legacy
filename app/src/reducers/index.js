import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import findInPage from './findInPage';
import nav from './nav';
import root from './root';
import screen from './screen';
import settings from './settings';

const rootReducer = combineReducers({
  findInPage,
  nav,
  root,
  screen,
  settings,
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
