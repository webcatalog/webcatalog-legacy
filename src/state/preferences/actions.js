import { SET_PREFERENCE } from '../../constants/actions';
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
