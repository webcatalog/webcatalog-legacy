import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogs from './dialogs/reducers';
import pages from './pages/reducers';

import auth from './root/auth/reducers';
import snackbar from './root/snackbar/reducers';
import user from './root/user/reducers';

const rootReducer = combineReducers({
  auth,
  dialogs,
  pages,
  snackbar,
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
