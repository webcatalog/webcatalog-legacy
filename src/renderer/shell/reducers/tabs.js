import Immutable from 'immutable';

import {
  ADD_TAB,
  CLOSE_TAB,
  UPDATE_ACTIVE_TAB,
  UPDATE_TAB_LAST_URL,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

const jsState = ipcRenderer.sendSync('get-setting', `tabs.${window.shellInfo.id}`, {
  list: [
    {
      id: new Date().getTime().toString(),
      isActive: true,
      name: null,
    },
  ],
}).map(tab => Object.assign({}, tab, {
  canGoBack: null,
  canGoForward: null,
}));

const initialState = Immutable.fromJS(jsState);

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACTIVE_TAB: {
      const newState = state.set('list', state.get('list').map((tab) => {
        if (tab.get('id') !== action.tabId) return tab.set('isActive', false);

        return tab.set('isActive', true);
      }));

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case UPDATE_TAB_LAST_URL: {
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

      let newActiveTabId = 0;

      const newList = state.get('list')
        .filter((tab, tabIndex) => {
          if (tab.get('id') === action.tabId) {
            newActiveTabId = tabIndex > 0 ? tabIndex - 1 : 0;
            return false;
          }
          return true;
        })
        .setIn([newActiveTabId, 'isActive'], true);

      const newState = state.set('list', newList);

      ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, newState.toJS());

      return newState;
    }
    case UPDATE_CAN_GO_BACK: {
      const tabIndex = state.get('list').findIndex(tab => tab.get('id') === action.tabId);

      const newState = state.set('list', state.get('list')
        .setIn([tabIndex, 'canGoBack'], action.canGoBack));

      return newState;
    }
    case UPDATE_CAN_GO_FORWARD: {
      const tabIndex = state.get('list').findIndex(tab => tab.get('id') === action.tabId);

      const newState = state.set('list', state.get('list')
        .setIn([tabIndex, 'canGoForward'], action.canGoForward));

      return newState;
    }
    default:
      return state;
  }
};

export default settings;
