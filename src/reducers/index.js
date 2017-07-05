import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import auth from './auth';
import dialogs from './dialogs';
import home from './home';
import snackbar from './snackbar';

const rootReducer = combineReducers({
  auth,
  dialogs,
  home,
  snackbar,
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
