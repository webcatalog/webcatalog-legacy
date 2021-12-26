/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  DIALOG_UPGRADE_CLOSE,
  DIALOG_UPGRADE_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_UPGRADE_CLOSE: return false;
    case DIALOG_UPGRADE_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
