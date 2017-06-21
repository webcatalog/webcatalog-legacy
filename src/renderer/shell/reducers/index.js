import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
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
