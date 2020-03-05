import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appManagement from './app-management/reducers';
import dialogAbout from './dialog-about/reducers';
import dialogChooseEngine from './dialog-choose-engine/reducers';
import dialogCreateCustomApp from './dialog-create-custom-app/reducers';
import dialogLicenseRegistration from './dialog-license-registration/reducers';
import dialogProxy from './dialog-proxy/reducers';
import dialogSetInstallationPath from './dialog-set-installation-path/reducers';
import dialogSetPreferredEngine from './dialog-set-preferred-engine/reducers';
import general from './general/reducers';
import home from './home/reducers';
import installed from './installed/reducers';
import preferences from './preferences/reducers';
import router from './router/reducers';
import systemPreferences from './system-preferences/reducers';
import updater from './updater/reducers';

const rootReducer = combineReducers({
  appManagement,
  dialogAbout,
  dialogChooseEngine,
  dialogCreateCustomApp,
  dialogLicenseRegistration,
  dialogProxy,
  dialogSetInstallationPath,
  dialogSetPreferredEngine,
  general,
  home,
  installed,
  preferences,
  router,
  systemPreferences,
  updater,
});

const configureStore = (initialState) => createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware),
);

// init store
const store = configureStore();

export default store;
