
import {
  DIALOG_LICENSE_REGISTRATION_CLOSE,
  DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
  DIALOG_LICENSE_REGISTRATION_OPEN,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import {
  requestSetPreference,
  requestShowMessageBox,
} from '../../senders';

export const close = () => ({
  type: DIALOG_LICENSE_REGISTRATION_CLOSE,
});

export const open = () => ({
  type: DIALOG_LICENSE_REGISTRATION_OPEN,
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

  requestSetPreference('registered', true);

  requestShowMessageBox('Registration Complete! Thank you for supporting the future development of WebCatalog. You may need to relaunch apps installed from WebCatalog for the license to be fully activated.');

  dispatch(close());
  return null;
};
