import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import createAppForm from './root/create-app-form/reducers';
import dialogs from './dialogs/reducers';
import preferences from './root/preferences/reducers';
import snackbar from './root/snackbar/reducers';
import updater from './root/updater/reducers';

const rootReducer = combineReducers({
  createAppForm,
  dialogs,
  preferences,
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
