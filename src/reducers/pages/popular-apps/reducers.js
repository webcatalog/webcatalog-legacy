import { combineReducers } from 'redux';

import apps from '../../../constants/apps';

const apiDataInitialState = {
  apps,
};

const apiData = (state = apiDataInitialState, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default combineReducers({
  apiData,
});
