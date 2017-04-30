import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from './reducers';

import { getBehaviors } from './actions/settings';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

  // load settings
  store.dispatch(getBehaviors());

  return store;
};

// init store
const store = configureStore();

export default store;
