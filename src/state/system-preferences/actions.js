/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_SYSTEM_PREFERENCE } from '../../constants/actions';

export const setSystemPreference = (name, value) => (dispatch) => {
  dispatch({
    type: SET_SYSTEM_PREFERENCE,
    name,
    value,
  });
};
