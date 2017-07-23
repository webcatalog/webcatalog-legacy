import {
  DIALOG_APP_DETAILS_CLOSE,
  DIALOG_APP_DETAILS_OPEN,
} from '../../constants/actions';

export const close = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_APP_DETAILS_CLOSE });
  };

export const open = form =>
  (dispatch) => {
    dispatch({
      type: DIALOG_APP_DETAILS_OPEN,
      form,
    });
  };
