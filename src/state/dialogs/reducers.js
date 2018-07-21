import { combineReducers } from 'redux';

import about from './about/reducers';
import clearBrowsingData from './clear-browsing-data/reducers';
import homePage from './home-page/reducers';
import injectCSS from './inject-css/reducers';
import injectJS from './inject-js/reducers';
import lockApp from './lock-app/reducers';
import preferences from './preferences/reducers';
import preferencesLock from './preferences-lock/reducers';
import proxyRules from './proxy-rules/reducers';
import relaunch from './relaunch/reducers';
import reset from './reset/reducers';
import titleBarColor from './title-bar-color/reducers';
import userAgent from './user-agent/reducers';

export default combineReducers({
  about,
  clearBrowsingData,
  homePage,
  injectCSS,
  injectJS,
  lockApp,
  preferences,
  preferencesLock,
  proxyRules,
  relaunch,
  reset,
  titleBarColor,
  userAgent,
});
