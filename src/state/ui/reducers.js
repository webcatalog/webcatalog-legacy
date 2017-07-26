import { combineReducers } from 'redux';

import dialogs from './dialogs/reducers';
import snackbar from './snackbar/reducers';

export default combineReducers({
  dialogs,
  snackbar,
});
