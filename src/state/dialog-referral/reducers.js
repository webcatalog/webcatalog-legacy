/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  DIALOG_REFERRAL_CLOSE,
  DIALOG_REFERRAL_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_REFERRAL_CLOSE: return false;
    case DIALOG_REFERRAL_OPEN: return true;
    default: return state;
  }
};

export default combineReducers({ open });
