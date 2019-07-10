import { combineReducers } from 'redux';

import about from './about/reducers';
import submitApp from './submit-app/reducers';

export default combineReducers({
  about,
  submitApp,
});
