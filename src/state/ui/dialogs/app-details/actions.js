import {
  dialogAppDetailsClose,
  dialogAppDetailsOpen,
} from './action-creators';

import { getAppDetails } from '../../../apps/details/actions';

export const close = () =>
  (dispatch) => {
    dispatch(dialogAppDetailsClose());
  };

export const open = form =>
  (dispatch) => {
    dispatch(dialogAppDetailsOpen(form));
    dispatch(getAppDetails());
  };
