import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import findInPage from './root/find-in-page/reducers';
import nav from './root/nav/reducers';
import screen from './root/screen/reducers';

// new reducers
import dialogs from '../state/dialogs/reducers';

const rootReducer = combineReducers({
  findInPage,
  nav,
  root,
  screen,
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
