import { batch } from 'react-redux';
import * as Comlink from 'comlink';

// eslint-disable-next-line
import Worker from 'worker-loader!./worker';

import {
  INSTALLED_UPDATE_QUERY,
  INSTALLED_UPDATE_ACTIVE_QUERY,
  INSTALLED_UPDATE_SCROLL_OFFSET,
  INSTALLED_SET_IS_SEARCHING,
} from '../../constants/actions';

export const updateActiveQuery = (activeQuery) => (dispatch, getState) => Promise.resolve()
  .then(async () => {
    dispatch({
      type: INSTALLED_SET_IS_SEARCHING,
      isSearching: true,
    });

    const { apps, sortedAppIds } = getState().appManagement;

    let newSortedAppIds = null;

    const worker = new Worker();
    const filterApps = Comlink.wrap(worker);

    if (activeQuery) {
      newSortedAppIds = await filterApps(apps, sortedAppIds, activeQuery);
      console.log(newSortedAppIds);
    }

    if (getState().installed.query !== activeQuery) return;
    console.log('wtf');
    batch(() => {
      dispatch({
        type: INSTALLED_SET_IS_SEARCHING,
        isSearching: false,
      });
      dispatch({
        type: INSTALLED_UPDATE_ACTIVE_QUERY,
        activeQuery,
        apps,
        sortedAppIds: newSortedAppIds,
      });
    });
  });

let timeout;
export const updateQuery = (query) => (dispatch) => {
  dispatch({
    type: INSTALLED_UPDATE_QUERY,
    query,
  });

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    dispatch(updateActiveQuery(query));
  }, 500);
};

export const updateScrollOffset = (scrollOffset) => ({
  type: INSTALLED_UPDATE_SCROLL_OFFSET,
  scrollOffset,
});
