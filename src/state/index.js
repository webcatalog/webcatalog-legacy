import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appManagement from './app-management/reducers';
import dialogAbout from './dialog-about/reducers';
import dialogChooseEngine from './dialog-choose-engine/reducers';
import dialogSetPreferredEngine from './dialog-set-preferred-engine/reducers';
import dialogCreateCustomApp from './dialog-create-custom-app/reducers';
import dialogLicenseRegistration from './dialog-license-registration/reducers';
import dialogSetInstallationPath from './dialog-set-installation-path/reducers';
import general from './general/reducers';
import home from './home/reducers';
import preferences from './preferences/reducers';
import router from './router/reducers';
import installed from './installed/reducers';

const rootReducer = combineReducers({
  appManagement,
  dialogAbout,
  dialogChooseEngine,
  dialogSetPreferredEngine,
  dialogCreateCustomApp,
  dialogLicenseRegistration,
  dialogSetInstallationPath,
  general,
  home,
  installed,
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
