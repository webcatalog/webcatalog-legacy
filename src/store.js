import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';


import rootReducer from './reducers';
import { scanInstalledApps } from './actions';

const configureStore = (initialState) => {
  const store = createStore(
    enableBatching(rootReducer),
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
