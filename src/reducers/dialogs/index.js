import { combineReducers } from 'redux';

import about from './about';
import submitApp from './submit-app';
import confirmUninstallApp from './confirm-uninstall-app';
import appDetails from './app-details';

export default combineReducers({
  about,
  submitApp,
  confirmUninstallApp,
  appDetails,
});
