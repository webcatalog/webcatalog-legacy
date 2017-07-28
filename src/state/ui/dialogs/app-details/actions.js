import {
  dialogAppDetailsClose,
  dialogAppDetailsOpen,
} from './action-creators';

export const close = () =>
  (dispatch) => {
    dispatch(dialogAppDetailsClose());
  };

export const open = form =>
  (dispatch) => {
    dispatch(dialogAppDetailsOpen(form));
  };
