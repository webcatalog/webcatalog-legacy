import Immutable from 'immutable';

import {
  ADD_TAB,
  SET_ACTIVE_TAB,
} from '../constants/actions';

const initialState = Immutable.fromJS({
  list: [
    {
      isActive: true,
      createdAt: new Date().getTime(),
      name: null,
    },
  ],
});


const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB: {
      return state.set('list', state.get('list').map((tab, tabIndex) => {
        if (tabIndex !== action.isActive) return tab.set('isActive', false);

        return tab.set('isActive', true);
      }));
    }
    case ADD_TAB: {
      if (state.get('list').size >= 9) {
        return state;
      }

      return state.set('list', state.get('list')
      .map(tab => tab.set('isActive', false))
      .push(Immutable.fromJS({
        createdAt: new Date().getTime(),
        name: null,
        isActive: true,
      })));
    }
    default:
      return state;
  }
};

export default settings;
