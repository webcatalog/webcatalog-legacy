/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_PREFERENCE, SET_PREFERENCES } from '../../constants/actions';
import { sortApps } from '../app-management/actions';

export const setPreference = (name, value) => (dispatch) => {
  dispatch({
    type: SET_PREFERENCE,
    name,
    value,
  });
  if (name === 'sortInstalledAppBy') {
    dispatch(sortApps());
  }
};

export const setPreferences = (newState) => (dispatch) => {
  dispatch({
    type: SET_PREFERENCES,
    preferences: newState,
  });
  dispatch(sortApps());
};
