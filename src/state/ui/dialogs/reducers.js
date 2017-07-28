import { combineReducers } from 'redux';

import about from './about/reducers';
import submitApp from './submit-app/reducers';
import confirmUninstallApp from './confirm-uninstall-app/reducers';
import appDetails from './app-details/reducers';

export default combineReducers({
  about,
  submitApp,
  confirmUninstallApp,
  appDetails,
});
