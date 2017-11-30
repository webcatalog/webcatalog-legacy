import { combineReducers } from 'redux';

const query = (state = '', action) => {
  switch (action.type) {
    default: return state;
  }
};

const hits = (state = [], action) => {
  switch (action.type) {
    default: return state;
  }
};

export default combineReducers({
  hits,
  query,
});
