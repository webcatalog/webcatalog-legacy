import { combineReducers } from 'redux';

import app from './app';
import search from './search';

const rootReducer = combineReducers({ app, search });

export default rootReducer;
