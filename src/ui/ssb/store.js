import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import rootReducer from './reducers';

import { getBehaviors } from './actions/settings';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(hashHistory),
    ),
  );

  // load settings
  store.dispatch(getBehaviors());

  return store;
};

// init store
const store = configureStore();

export default store;
