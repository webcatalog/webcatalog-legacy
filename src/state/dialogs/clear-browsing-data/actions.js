import {
  dialogClearBrowsingDataClose,
  dialogClearBrowsingDataOpen,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogClearBrowsingDataClose());

export const open = () =>
  dispatch => dispatch(dialogClearBrowsingDataOpen());
