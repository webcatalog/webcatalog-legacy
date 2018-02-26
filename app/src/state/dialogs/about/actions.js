import {
  dialogAboutClose,
  dialogAboutOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogAboutClose());

export const open = () =>
  dispatch => dispatch(dialogAboutOpen());
