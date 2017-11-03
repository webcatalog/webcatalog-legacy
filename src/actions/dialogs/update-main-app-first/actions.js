import {
  dialogUpdateMainAppFirstClose,
  dialogUpdateMainAppFirstOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogUpdateMainAppFirstClose());

export const open = () =>
  dispatch => dispatch(dialogUpdateMainAppFirstOpen());
