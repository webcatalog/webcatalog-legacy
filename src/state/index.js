import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appManagement from './app-management/reducers';
import dialogAbout from './dialog-about/reducers';
import dialogCreateCustomApp from './dialog-create-custom-app/reducers';
import dialogLicenseRegistration from './dialog-license-registration/reducers';
import dialogSetInstallationPath from './dialog-set-installation-path/reducers';
import general from './general/reducers';
import home from './home/reducers';
import preferences from './preferences/reducers';
import router from './router/reducers';

const rootReducer = combineReducers({
  appManagement,
  dialogAbout,
  dialogCreateCustomApp,
  dialogLicenseRegistration,
  dialogSetInstallationPath,
  general,
  home,
  preferences,
  router,
});

const configureStore = (initialState) => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware),
);

// init store
const store = configureStore();

export default store;
