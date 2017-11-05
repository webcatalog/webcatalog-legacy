import { combineReducers } from 'redux';

import about from './about/reducers';
import account from './account/reducers';
import confirmUninstallApp from './confirm-uninstall-app/reducers';
import submitApp from './submit-app/reducers';
import updateMainAppFirst from './update-main-app-first/reducers';

export default combineReducers({
  about,
  account,
  confirmUninstallApp,
  submitApp,
  updateMainAppFirst,
});
