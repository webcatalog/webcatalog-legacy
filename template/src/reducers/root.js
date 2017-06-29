import {
  ADD_TAB,
  REMOVE_TAB,
  SET_ACTIVE_TAB,
  SWAP_TAB,
} from '../constants/actions';

const createTab = (tabs) => {
  const availableColors = [
    'blue', 'red', 'pink',
    'purple', 'deepPurple', 'teal',
    'green', 'deepOrange', 'brown', // maximum 9 tabs
  ].filter((color) => {
    const alreadyUsed = tabs && tabs.some(tab => tab.color === color);

    return !alreadyUsed;
  });

  const availableIds = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, // maximum 9 tabs
  ].filter((id) => {
    const alreadyUsed = tabs && tabs.some(tab => tab.id === id);

    return !alreadyUsed;
  });

  return {
    id: availableIds[0], // Use the first available ID
    isActive: true,
    color: availableColors[0], // Use the first available color
  };
};

const initialState = {
  tabs: [createTab([])],
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAB: {
      // maximum 9 tabs
      if (state.tabs.length === 9) return state;

      const tabs = state.tabs
        // deactive all existed tabs
        .map(tab => Object.assign({}, tab, { isActive: false }));

      return Object.assign({}, state, { tabs: tabs.concat([createTab(tabs)]) });
    }
    case REMOVE_TAB: {
      const tabs = state.tabs;

      // remove tab
      const filteredTabs = tabs
        .filter((tab, i) => {
          const isRemoved = tab.id === action.id;

          if (isRemoved && tab.isActive) {
            // active other tab
            if (tabs.length > 1) {
              if (i > 0) {
                tabs[i - 1].isActive = true;
              } else {
                tabs[i + 1].isActive = true;
              }
            }
          }

          return !isRemoved;
        });

      return Object.assign({}, state, {
        tabs: filteredTabs.length > 0 ? filteredTabs : [createTab()],
      });
    }
    case SWAP_TAB: {
      const tabs = state.tabs;

      const x = action.firstIndex;
      const y = action.secondIndex;

      const b = Object.assign({}, tabs[x]);

      tabs[x] = Object.assign({}, tabs[y]);

      tabs[y] = b;

      return Object.assign({}, state, { tabs: tabs.slice() });
    }
    case SET_ACTIVE_TAB: {
      const tabs = state.tabs
        .map((tab) => {
          if (tab.id === action.id) {
            return Object.assign({}, tab, { isActive: true });
          }

          if (tab.isActive) {
            return Object.assign({}, tab, { isActive: false });
          }

          return tab;
        });

      return Object.assign({}, state, { tabs });
    }
    default:
      return state;
  }
};

export default settings;
