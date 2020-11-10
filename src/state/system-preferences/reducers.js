/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_SYSTEM_PREFERENCE } from '../../constants/actions';

import { getSystemPreferences } from '../../senders';

const initialState = getSystemPreferences();

const systemPreferences = (state = initialState, action) => {
  switch (action.type) {
    case SET_SYSTEM_PREFERENCE: {
      const newState = { ...state };
      newState[action.name] = action.value;

      return newState;
    }
    default:
      return state;
  }
};

export default systemPreferences;
