import {
  dialogRelaunchClose,
  dialogRelaunchOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogRelaunchClose());

export const open = () =>
  dispatch => dispatch(dialogRelaunchOpen());
