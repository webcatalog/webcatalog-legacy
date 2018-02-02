import { combineReducers } from 'redux';

import about from './about/reducers';
import preferences from './preferences/reducers';

export default combineReducers({
  about,
  preferences,
});
