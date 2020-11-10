/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  DIALOG_CREATE_CUSTOM_APP_CLOSE,
  DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE,
  DIALOG_CREATE_CUSTOM_APP_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CREATE_CUSTOM_APP_CLOSE: return false;
    case DIALOG_CREATE_CUSTOM_APP_OPEN: return true;
    default: return state;
  }
};

const formInitialState = {
  name: '',
  url: 'https://',
  urlDisabled: false,
  icon: null,
};
const form = (state = formInitialState, action) => {
  switch (action.type) {
    case DIALOG_CREATE_CUSTOM_APP_OPEN: return { ...formInitialState, ...action.form };
    case DIALOG_CREATE_CUSTOM_APP_FORM_UPDATE: {
      const { changes } = action;
      return { ...state, ...changes };
    }
    default: return state;
  }
};

const downloadingIcon = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CREATE_CUSTOM_APP_OPEN: return false;
    case DIALOG_CREATE_CUSTOM_APP_DOWNLOADING_ICON_UPDATE: return action.downloadingIcon;
    default: return state;
  }
};

export default combineReducers({
  downloadingIcon,
  form,
  open,
});
