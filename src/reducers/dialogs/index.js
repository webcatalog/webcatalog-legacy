import { combineReducers } from 'redux';

import about from './about';
import submitApp from './submit-app';
import confirmUninstallApp from './confirm-uninstall-app';

export default combineReducers({
  about,
  submitApp,
  confirmUninstallApp,
});
