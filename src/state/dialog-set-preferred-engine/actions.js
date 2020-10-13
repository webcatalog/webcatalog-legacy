import {
  DIALOG_SET_PREFERRED_ENGINE_CLOSE,
  DIALOG_SET_PREFERRED_ENGINE_FORM_UPDATE,
  DIALOG_SET_PREFERRED_ENGINE_OPEN,
} from '../../constants/actions';

import {
  requestSetPreference,
} from '../../senders';

import {
  open as openDialogLicenseRegistration,
} from '../dialog-license-registration/actions';

export const close = () => ({
  type: DIALOG_SET_PREFERRED_ENGINE_CLOSE,
});

export const updateForm = (changes) => (dispatch, getState) => {
  const { registered } = getState().preferences;
  if (!registered) {
    dispatch(openDialogLicenseRegistration());
    return;
  }

  dispatch({
    type: DIALOG_SET_PREFERRED_ENGINE_FORM_UPDATE,
    changes,
  });
};

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
  const { registered, preferredEngine } = getState().preferences;

  dispatch({
    type: DIALOG_SET_PREFERRED_ENGINE_OPEN,
    engine: registered ? preferredEngine : 'electron',
  });
};
