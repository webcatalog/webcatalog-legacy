import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appManagement from './app-management/reducers';
import dialogCreateCustomApp from './dialog-create-custom-app/reducers';
import dialogLicenseRegistration from './dialog-license-registration/reducers';
import general from './general/reducers';
import preferences from './preferences/reducers';
import router from './router/reducers';
import home from './home/reducers';

const rootReducer = combineReducers({
  appManagement,
  dialogCreateCustomApp,
  dialogLicenseRegistration,
  general,
  home,
  preferences,
  router,
});

const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware),
);

// init store
const store = configureStore();

export default store;
