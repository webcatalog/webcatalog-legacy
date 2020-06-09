import { batch } from 'react-redux';

import { SET_PREFERENCE } from '../../constants/actions';
import { sortApps } from '../app-management/actions';
import { updateActiveQuery } from '../installed/actions';

export const setPreference = (name, value) => (dispatch, getState) => {
  dispatch({
    type: SET_PREFERENCE,
    name,
    value,
  });
  if (name === 'sortInstalledAppBy') {
    batch(() => {
      dispatch(sortApps());
      // regenerate filtered list
      dispatch(updateActiveQuery(getState().installed.activeQuery));
    });
  }
};
