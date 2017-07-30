import { combineReducers } from 'redux';

import dialogs from './dialogs/reducers';
import snackbar from './snackbar/reducers';
import routes from './routes/reducers';

export default combineReducers({
  dialogs,
  snackbar,
  routes,
});
