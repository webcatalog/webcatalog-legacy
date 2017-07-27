import { combineReducers } from 'redux';

import account from './account/reducers';
import about from './about/reducers';
import submitApp from './submit-app/reducers';
import confirmUninstallApp from './confirm-uninstall-app/reducers';
import appDetails from './app-details/reducers';

export default combineReducers({
	account,
  about,
  submitApp,
  confirmUninstallApp,
  appDetails,
});
