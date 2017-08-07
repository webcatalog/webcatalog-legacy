import { combineReducers } from 'redux';

import dialogs from './dialogs/reducers';
import routes from './routes/reducers';
import search from './search/reducers';
import snackbar from './snackbar/reducers';

export default combineReducers({
  dialogs,
  routes,
  search,
  snackbar,
});
