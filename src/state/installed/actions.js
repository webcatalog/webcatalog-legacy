import {
  INSTALLED_UPDATE_QUERY,
  INSTALLED_UPDATE_ACTIVE_QUERY,
} from '../../constants/actions';

export const updateActiveQuery = (activeQuery) => (dispatch, getState) => {
  const state = getState();
  const { apps, sortedAppIds } = state.appManagement;
  dispatch({
    type: INSTALLED_UPDATE_ACTIVE_QUERY,
    activeQuery,
    apps,
    sortedAppIds,
  });
};

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
