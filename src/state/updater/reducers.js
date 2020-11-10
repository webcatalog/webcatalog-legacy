/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { UPDATE_UPDATER } from '../../constants/actions';

const updater = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_UPDATER: {
      return action.updaterObj;
    }
    default:
      return state;
  }
};

export default updater;
