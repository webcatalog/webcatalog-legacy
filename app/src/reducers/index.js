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

// new reducers
import dialogs from '../state/dialogs/reducers';

const rootReducer = combineReducers({
  findInPage,
  nav,
  root,
  screen,
  settings,
  dialogs,
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
