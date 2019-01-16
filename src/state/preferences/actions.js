import { SET_PREFERENCE } from '../../constants/actions';

export const setPreference = (name, value) => ({
  type: SET_PREFERENCE,
  name,
  value,
});
