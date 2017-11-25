import { combineReducers } from 'redux';

import about from './about/reducers';
import confirmUninstallApp from './confirm-uninstall-app/reducers';
import updateMainAppFirst from './update-main-app-first/reducers';

export default combineReducers({
  about,
  confirmUninstallApp,
  updateMainAppFirst,
});
