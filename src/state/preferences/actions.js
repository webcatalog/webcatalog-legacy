import { SET_PREFERENCE, SET_PREFERENCES } from '../../constants/actions';
import { sortApps } from '../app-management/actions';

export const setPreference = (name, value) => (dispatch) => {
  dispatch({
    type: SET_PREFERENCE,
    name,
    value,
  });
  if (name === 'sortInstalledAppBy') {
    dispatch(sortApps());
  }
};

export const setPreferences = (newState) => (dispatch) => {
  dispatch({
    type: SET_PREFERENCES,
    preferences: newState,
  });
  dispatch(sortApps());
};
