import Immutable from 'immutable';

import {
  ADD_TAB,
  CLOSE_TAB,
  UPDATE_ACTIVE_TAB,
  UPDATE_TAB_LAST_URL,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
} from '../constants/actions';

const getPartition = (state) => {
  let potentialPartitions = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i =>
    ((i === 0) ? `persist:${window.shellInfo.id}` : `persist:${window.shellInfo.id}_${i}`),
  );

  state.get('list').forEach((tab) => {
    potentialPartitions = potentialPartitions.filter(partition => partition !== tab.get('partition'));
  });

  return potentialPartitions[0];
};

const jsState = ipcRenderer.sendSync('get-setting', `tabs.${window.shellInfo.id}`, {
  list: [
    {
      id: new Date().getTime().toString(),
      isActive: true,
      name: null,
      partition: `persist:${window.shellInfo.id}`,
    },
  ],
});

let initialState = Immutable.fromJS(jsState);
// set partition if not set
initialState = initialState.set('list', initialState.get('list').map((tab) => {
  if (tab.get('partition')) return tab;

  return tab.set('partition', getPartition(initialState));
}));

const saveToElectronSetting = (state) => {
  const strippedState = state.set('list',
    state.get('list')
      .map(tab => tab.remove('canGoBack').remove('canGoForward')),
  );

  ipcRenderer.send('set-setting', `tabs.${window.shellInfo.id}`, strippedState.toJS());
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACTIVE_TAB: {
      const newState = state.set('list', state.get('list').map((tab) => {
        if (tab.get('id') !== action.tabId) return tab.set('isActive', false);

        return tab.set('isActive', true);
      }));

      saveToElectronSetting(newState);

      return newState;
    }
    case UPDATE_TAB_LAST_URL: {
      const tabIndex = state.get('list').findIndex(tab => tab.get('id') === action.tabId);

      const newState = state.set('list', state.get('list')
        .setIn([tabIndex, 'lastUrl'], action.lastUrl));

      saveToElectronSetting(newState);

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
          partition: getPartition(state),
        }));

      const newState = state.set('list', newList);

      saveToElectronSetting(newState);

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
            ipcRenderer.send('clear-partition', tab.get('partition'));

            newActiveTabId = tabIndex > 0 ? tabIndex - 1 : 0;
            return false;
          }
          return true;
        })
        .setIn([newActiveTabId, 'isActive'], true);

      const newState = state.set('list', newList);

      saveToElectronSetting(newState);

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
