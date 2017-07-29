import { combineReducers } from 'redux';

import appBar from './app-bar/reducers';
import dialogs from './dialogs/reducers';
import snackbar from './snackbar/reducers';

export default combineReducers({
  appBar,
  dialogs,
  snackbar,
});
