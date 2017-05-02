import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';

import rootReducer from './reducers';

const configureStore = (initialState) => {
  const store = createStore(
    enableBatching(rootReducer),
    initialState,
    applyMiddleware(thunkMiddleware),
  );

  return store;
};

// init store
const store = configureStore();

export default store;
