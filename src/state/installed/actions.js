/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { batch } from 'react-redux';
import * as Comlink from 'comlink';

// eslint-disable-next-line
import Worker from 'worker-loader!./worker';

import {
  INSTALLED_UPDATE_QUERY,
  INSTALLED_UPDATE_ACTIVE_QUERY,
  INSTALLED_UPDATE_SCROLL_OFFSET,
  INSTALLED_UPDATE_SORTED_APP_IDS,
  INSTALLED_SET_IS_SEARCHING,
} from '../../constants/actions';

export const updateActiveQuery = (activeQuery) => (dispatch, getState) => Promise.resolve()
  .then(async () => {
    batch(() => {
      dispatch({
        type: INSTALLED_SET_IS_SEARCHING,
        isSearching: true,
      });
      dispatch({
        type: INSTALLED_UPDATE_ACTIVE_QUERY,
        activeQuery,
      });
    });

    const { apps, sortedAppIds } = getState().appManagement;
    let newSortedAppIds = null;

    if (activeQuery) {
      const worker = new Worker();
      const filterApps = Comlink.wrap(worker);
      newSortedAppIds = await filterApps(apps, sortedAppIds, activeQuery);
      worker.terminate();
    }

    if (getState().installed.query !== activeQuery) return;
    batch(() => {
      dispatch({
        type: INSTALLED_SET_IS_SEARCHING,
        isSearching: false,
      });
      dispatch({
        type: INSTALLED_UPDATE_SORTED_APP_IDS,
        sortedAppIds: newSortedAppIds,
      });
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(err);
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
