import { combineReducers } from 'redux';

import password from './password/reducers';
import profile from './profile/reducers';

export default combineReducers({
  password,
  profile,
});
