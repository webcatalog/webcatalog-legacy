import { combineReducers } from 'redux';

import about from './about/reducers';
import confirmUninstallApp from './confirm-uninstall-app/reducers';
import createCustomApp from './create-custom-app/reducers';
import preferences from './preferences/reducers';

export default combineReducers({
  about,
  confirmUninstallApp,
  createCustomApp,
  preferences,
});
