/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_LICENSE_REGISTRATION_CLOSE,
  DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
  DIALOG_LICENSE_REGISTRATION_OPEN,
  DIALOG_LICENSE_REGISTRATION_SET_VERIFYING,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import firebase from '../../firebase';

import {
  requestShowMessageBox,
} from '../../senders';

export const close = () => ({
  type: DIALOG_LICENSE_REGISTRATION_CLOSE,
});

export const open = () => ({
  type: DIALOG_LICENSE_REGISTRATION_OPEN,
});

export const setVerifying = (verifying) => ({
  type: DIALOG_LICENSE_REGISTRATION_SET_VERIFYING,
  verifying,
});

const getValidationRules = () => ({
  licenseKey: {
    fieldName: 'License Key',
    required: true,
    licenseKey: true,
  },
});

export const updateForm = (changes) => ({
  type: DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
  changes: validate(changes, getValidationRules()),
});

export const register = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogLicenseRegistration;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  dispatch(setVerifying(true));
  firebase.functions().httpsCallable('checkLegacyLicense')({ licenseKey: form.licenseKey })
    .then(() => {
      requestShowMessageBox('WebCatalog Lifetime is activated successfully! Thank you for your support.', 'info');
      dispatch(close());
    })
    .catch((err) => {
      dispatch({
        type: DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
        changes: {
          ...validatedChanges,
          licenseKeyError: `${err.message}.`,
        },
      });
    })
    .then(() => {
      dispatch(setVerifying(false));
    });

  return null;
};
