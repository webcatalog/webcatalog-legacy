import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import general from './general/reducers';
import preferences from './preferences/reducers';
import workspaces from './workspaces/reducers';
import editWorkspace from './edit-workspace/reducers';

import loadListeners from '../listeners';

const rootReducer = combineReducers({
  general,
  preferences,
  workspaces,
  editWorkspace,
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
