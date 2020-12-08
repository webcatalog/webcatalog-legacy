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

import { requestShowMessageBox } from '../../senders';

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
    engine, id, icon, name, url, opts,
  } = form;

  if (isNameExisted(name, state)) {
    requestShowMessageBox(`An app named ${name} already exists.`, 'error');
    return null;
  }

  dispatch(installApp(engine, id, name, url, icon, opts));

  dispatch(close());
  return null;
};

export const open = (id, name, url, icon, opts = {}) => (dispatch, getState) => {
  const state = getState();

  const { hideEnginePrompt, preferredEngine } = state.preferences;

  // WidevineCDM doesn't work with WebCatalog Engine (Electron)
  // we force users to choose another engine
  const forceEnginePrompt = preferredEngine === 'electron' && opts.widevine;
  if (hideEnginePrompt && !forceEnginePrompt) {
    dispatch(updateForm({
      engine: preferredEngine,
      icon,
      id,
      name,
      url,
      opts,
    }));

    return dispatch(create());
  }

  // WidevineCDM doesn't work with WebCatalog Engine (Electron)
  // so we pick another engine
  let selectedEngine = preferredEngine;
  if (preferredEngine === 'electron' && opts.widevine) {
    switch (window.process.platform) {
      case 'darwin':
        selectedEngine = 'webkit';
        break;
      case 'win32':
        selectedEngine = 'edge';
        break;
      case 'linux':
        selectedEngine = 'firefox';
        break;
      default:
        break;
    }
  }

  return dispatch({
    type: DIALOG_CHOOSE_ENGINE_OPEN,
    engine: selectedEngine,
    icon,
    id,
    name,
    url,
    opts,
  });
};
