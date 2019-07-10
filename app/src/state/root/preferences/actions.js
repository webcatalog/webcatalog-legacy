import { preferencesSet } from './action-creators';

export const setPreference = (name, value) =>
  (dispatch) => {
    dispatch(preferencesSet(name, value));
  };
