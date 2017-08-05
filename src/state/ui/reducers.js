import { combineReducers } from 'redux';

import dialogs from './dialogs/reducers';
import routes from './routes/reducers';
import searchBox from './searchBox/reducers';
import snackbar from './snackbar/reducers';

export default combineReducers({
  dialogs,
  routes,
  searchBox,
  snackbar,
});
