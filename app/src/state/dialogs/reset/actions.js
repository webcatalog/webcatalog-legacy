import {
  dialogResetClose,
  dialogResetOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogResetClose());

export const open = () =>
  dispatch => dispatch(dialogResetOpen());
