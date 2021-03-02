/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_SET_PREFERRED_ENGINE_CLOSE,
  DIALOG_SET_PREFERRED_ENGINE_FORM_UPDATE,
  DIALOG_SET_PREFERRED_ENGINE_OPEN,
} from '../../constants/actions';

import {
  requestSetPreference,
} from '../../senders';

export const close = () => ({
  type: DIALOG_SET_PREFERRED_ENGINE_CLOSE,
});

export const updateForm = (changes) => ({
  type: DIALOG_SET_PREFERRED_ENGINE_FORM_UPDATE,
  changes,
});

export const save = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogSetPreferredEngine;

  const {
    engine,
  } = form;

  requestSetPreference('preferredEngine', engine);

  dispatch(close());
};

export const open = () => (dispatch, getState) => {
  const { preferredEngine } = getState().preferences;

  dispatch({
    type: DIALOG_SET_PREFERRED_ENGINE_OPEN,
    engine: preferredEngine,
  });
};
