import { combineReducers } from 'redux';

import about from './about/reducers';
import activate from './activate/reducers';
import addWorkspace from './add-workspace/reducers';
import clearBrowsingData from './clear-browsing-data/reducers';
import injectCSS from './inject-css/reducers';
import injectJS from './inject-js/reducers';
import lockApp from './lock-app/reducers';
import preferences from './preferences/reducers';
import proxyRules from './proxy-rules/reducers';
import relaunch from './relaunch/reducers';
import reset from './reset/reducers';
import userAgent from './user-agent/reducers';

export default combineReducers({
  about,
  activate,
  addWorkspace,
  clearBrowsingData,
  injectCSS,
  injectJS,
  lockApp,
  preferences,
  proxyRules,
  relaunch,
  reset,
  userAgent,
});
