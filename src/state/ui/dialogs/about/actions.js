import {
  DIALOG_ABOUT_CLOSE,
  DIALOG_ABOUT_OPEN,
} from '../../../../constants/actions';

export const close = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_ABOUT_CLOSE });
  };
export const open = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_ABOUT_OPEN });
  };
