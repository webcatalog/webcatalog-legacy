import Immutable from 'immutable';

import {
  ADD_TAB,
  SET_ACTIVE_TAB,
  SET_TAB_LAST_URL,
} from '../constants/actions';

const jsState = ipcRenderer.sendSync('get-setting', `tabs.${window.shellInfo.id}`, {
  list: [
    {
      isActive: true,
      createdAt: new Date().getTime(),
      name: null,
    },
  ],
});

const initialState = Immutable.fromJS(jsState);

const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB: {
      const newState = state.set('list', state.get('list').map((tab, tabIndex) => {
        if (tabIndex !== action.isActive) return tab.set('isActive', false);

        return tab.set('isActive', true);
      }));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case SET_TAB_LAST_URL: {
      const newState = state.set('list', state.get('list')
        .setIn([action.tabIndex, 'lastUrl'], action.lastUrl));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case ADD_TAB: {
      if (state.get('list').size >= 9) {
        return state;
      }

      const newState = state.set('list', state.get('list')
      .map(tab => tab.set('isActive', false))
      .push(Immutable.fromJS({
        createdAt: new Date().getTime(),
        name: null,
        isActive: true,
      })));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    default:
      return state;
  }
};

export default settings;
