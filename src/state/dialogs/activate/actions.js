import {
  dialogActivateClose,
  dialogActivateOpen,
  dialogActivateFormUpdate,
} from './action-creators';

import { openSnackbar } from '../../root/snackbar/actions';
import { updateActivated } from '../../root/general/actions';

import isLicenseKeyValid from '../../../helpers/is-license-key-valid';

import {
  STRING_ACTIVATED,
  STRING_INVALID_LICENSE_KEY,
} from '../../../constants/strings';

export const close = () =>
  dispatch => dispatch(dialogActivateClose());

export const open = () =>
  dispatch => dispatch(dialogActivateOpen());

export const activate = () =>
  (dispatch, getState) => {
    const inputLicenseKey = getState().dialogs.activate.form.licenseKey;

    if (isLicenseKeyValid(inputLicenseKey)) {
      dispatch(openSnackbar(STRING_ACTIVATED));
      dispatch(dialogActivateClose());
      dispatch(updateActivated(true));

      window.localStorage.setItem('licenseKey', inputLicenseKey);
    } else {
      dispatch(openSnackbar(STRING_INVALID_LICENSE_KEY));
    }
  };

export const updateForm = changes =>
  (dispatch) => {
    dispatch(dialogActivateFormUpdate(changes));
  };
