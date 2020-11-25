/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_CHOOSE_ENGINE_CLOSE,
  DIALOG_CHOOSE_ENGINE_FORM_UPDATE,
  DIALOG_CHOOSE_ENGINE_OPEN,
} from '../../constants/actions';

import { installApp } from '../app-management/actions';
import {
  isNameExisted,
} from '../app-management/utils';

import { requestShowMessageBox, getPreference } from '../../senders';

export const close = () => ({
  type: DIALOG_CHOOSE_ENGINE_CLOSE,
});

export const updateForm = (changes) => ({
  type: DIALOG_CHOOSE_ENGINE_FORM_UPDATE,
  changes,
});

export const create = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogChooseEngine;

  const {
    engine, id, icon, name, url,
  } = form;

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(installApp(engine, id, name, url, icon));

  dispatch(close());
  return null;
};

export const open = (id, name, url, icon) => (dispatch, getState) => {
  const state = getState();

  const { hideEnginePrompt } = state.preferences;
  if (hideEnginePrompt) {
    dispatch(updateForm({
      engine: getPreference('preferredEngine'),
      icon,
      id,
      name,
      url,
    }));

    return dispatch(create());
  }

  return dispatch({
    type: DIALOG_CHOOSE_ENGINE_OPEN,
    engine: getPreference('preferredEngine'),
    icon,
    id,
    name,
    url,
  });
};
