import Immutable from 'immutable';

import {
  ADD_TAB,
  CLOSE_TAB,
  SET_ACTIVE_TAB,
  SET_TAB_LAST_URL,
} from '../constants/actions';

const jsState = ipcRenderer.sendSync('get-setting', `tabs.${window.shellInfo.id}`, {
  list: [
    {
      id: new Date().getTime().toString(),
      isActive: true,
      name: null,
    },
  ],
});

const initialState = Immutable.fromJS(jsState);

const settings = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB: {
      const newState = state.set('list', state.get('list').map((tab) => {
        if (tab.get('id') !== action.tabId) return tab.set('isActive', false);

        return tab.set('isActive', true);
      }));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case SET_TAB_LAST_URL: {
      const tabIndex = state.get('list').findIndex(tab => tab.get('id') === action.tabId);

      const newState = state.set('list', state.get('list')
        .setIn([tabIndex, 'lastUrl'], action.lastUrl));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case ADD_TAB: {
      if (state.get('list').size >= 9) {
        return state;
      }

      const newList = state.get('list')
        .map(tab => tab.set('isActive', false))
        .push(Immutable.fromJS({
          id: new Date().getTime().toString(),
          name: null,
          isActive: true,
        }));

      const newState = state.set('list', newList);

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case CLOSE_TAB: {
      const listSize = state.get('list').size;

      if (listSize < 2) {
        return state;
      }

      let newActiveTab = 0;

      const newList = state.get('list')
        .filter((tab, tabIndex) => {
          if (tab.get('id') === action.tabId) {
            newActiveTab = tabIndex !== 0 ? tabIndex - 1 : 0;
            return false;
          }
          return true;
        })
        .setIn([newActiveTab, 'isActive'], true);

      const newState = state.set('list', newList);

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    default:
      return state;
  }
};

export default settings;
