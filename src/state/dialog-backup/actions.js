/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  DIALOG_BACKUP_APP_DETAILS_CLOSE,
  DIALOG_BACKUP_APP_DETAILS_OPEN,
} from '../../constants/actions';
import { open as openDialogLicenseRegistration } from '../dialog-license-registration/actions';

export const close = () => ({
  type: DIALOG_BACKUP_APP_DETAILS_CLOSE,
});

export const open = () => (dispatch, getState) => {
  const { registered } = getState().preferences;
  if (!registered) {
    dispatch(openDialogLicenseRegistration());
    return;
  }

  dispatch({
    type: DIALOG_BACKUP_APP_DETAILS_OPEN,
  });
};
