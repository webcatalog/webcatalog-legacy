import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { hashHistory } from 'react-router';

import rootReducer from './reducers';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(hashHistory),
    ),
  );

  return store;
};

// init store
const store = configureStore();

export default store;
