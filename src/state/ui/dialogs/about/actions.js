import {
  dialogAccountClose,
  dialogAccountOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogAccountClose());

export const open = () =>
  dispatch => dispatch(dialogAccountOpen());
