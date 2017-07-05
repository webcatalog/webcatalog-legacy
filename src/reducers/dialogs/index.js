import { combineReducers } from 'redux';

import about from './about';
import submitApp from './submit-app';

export default combineReducers({
	about,
  submitApp,
});
