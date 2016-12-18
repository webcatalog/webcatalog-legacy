import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';
import { scanInstalledApps } from './actions';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
    ),
  );

  // load installed Apps
  store.dispatch(scanInstalledApps());

  return store;
};

// init store
const store = configureStore();

export default store;
