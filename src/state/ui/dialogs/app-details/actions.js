import {
  dialogAppDetailsClose,
  dialogAppDetailsOpen,
} from './action-creators';

import { resetAppDetails } from '../../../resets/actions';

import { getAppDetails } from '../../../apps/details/actions';

export const close = () =>
  (dispatch) => {
    dispatch(dialogAppDetailsClose());
    dispatch(resetAppDetails());
  };

export const open = form =>
  (dispatch) => {
    dispatch(dialogAppDetailsOpen(form));
    dispatch(getAppDetails());
  };
