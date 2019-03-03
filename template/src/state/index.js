import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import editWorkspace from './edit-workspace/reducers';
import findInPage from './find-in-page/reducers';
import general from './general/reducers';
import preferences from './preferences/reducers';
import systemPreferences from './system-preferences/reducers';
import workspaces from './workspaces/reducers';

import loadListeners from '../listeners';

const rootReducer = combineReducers({
  editWorkspace,
  findInPage,
  general,
  preferences,
  systemPreferences,
  workspaces,
});

const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware),
);

// init store
const store = configureStore();

loadListeners(store);

export default store;
