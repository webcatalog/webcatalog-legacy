import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import home from './home';

const rootReducer = combineReducers({
  home,
});

const configureStore = initialState =>
  createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

// init store
const store = configureStore();

export default store;
