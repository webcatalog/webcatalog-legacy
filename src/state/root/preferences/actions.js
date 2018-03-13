import { preferenceUpdate } from './action-creators';

import { updateBrowserInstalled } from '../general/actions';

export const updatePreference = (name, value) =>
  (dispatch) => {
    dispatch(preferenceUpdate(name, value));

    if (name === 'browser') {
      dispatch(updateBrowserInstalled());
    }
  };
