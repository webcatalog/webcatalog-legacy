/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import {
  DIALOG_RESTORE_APP_DETAILS_CLOSE,
  DIALOG_RESTORE_APP_DETAILS_OPEN,
} from '../../constants/actions';
import { open as openDialogUpgrade } from '../dialog-upgrade/actions';
import { getCurrentPlan } from '../user/utils';

export const close = () => ({
  type: DIALOG_RESTORE_APP_DETAILS_CLOSE,
});

export const open = () => (dispatch, getState) => {
  const currentPlan = getCurrentPlan(getState());
  if (currentPlan === 'basic') {
    dispatch(openDialogUpgrade());
    return;
  }

  dispatch({
    type: DIALOG_RESTORE_APP_DETAILS_OPEN,
  });
};
