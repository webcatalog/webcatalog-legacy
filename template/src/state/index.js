import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import dialogAuth from './dialog-auth/reducers';
import dialogCodeInjection from './dialog-code-injection/reducers';
import dialogCustomUserAgent from './dialog-custom-user-agent/reducers';
import dialogEditWorkspace from './dialog-edit-workspace/reducers';
import dialogGoToUrl from './dialog-go-to-url/reducers';
import dialogProxy from './dialog-proxy/reducers';
import findInPage from './find-in-page/reducers';
import general from './general/reducers';
import notifications from './notifications/reducers';
import preferences from './preferences/reducers';
import systemPreferences from './system-preferences/reducers';
import workspaces from './workspaces/reducers';

import loadListeners from '../listeners';

const rootReducer = combineReducers({
  dialogAuth,
  dialogCodeInjection,
  dialogCustomUserAgent,
  dialogEditWorkspace,
  dialogGoToUrl,
  dialogProxy,
  findInPage,
  general,
  notifications,
  preferences,
  systemPreferences,
  workspaces,
});

const configureStore = (initialState) => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware),
);

// init store
const store = configureStore();

loadListeners(store);

export default store;
