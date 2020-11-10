/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_PREFERENCE, SET_PREFERENCES } from '../../constants/actions';

import { getPreferences } from '../../senders';

const initialState = getPreferences();

const preferences = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREFERENCES: {
      return action.preferences;
    }
    case SET_PREFERENCE: {
      const newState = { ...state };
      newState[action.name] = action.value;

      return newState;
    }
    default:
      return state;
  }
};

export default preferences;
