import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import rootReducer from './reducers';
import { scanInstalledApps } from './actions/app';
import { getBehaviors } from './actions/settings';

const configureStore = (initialState) => {
  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(hashHistory),
    ),
  );

  // load installed Apps
  store.dispatch(scanInstalledApps());
  // load settings
  store.dispatch(getBehaviors());

  return store;
};

// init store
const store = configureStore();

export default store;
