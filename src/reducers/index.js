import { combineReducers } from 'redux';

import app from './app';
import search from './search';
import settings from './settings';

const rootReducer = combineReducers({ app, search, settings });

export default rootReducer;
