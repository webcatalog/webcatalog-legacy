import {
  DIALOG_SUBMIT_APP_CLOSE,
  DIALOG_SUBMIT_APP_FORM_UPDATE,
  DIALOG_SUBMIT_APP_OPEN,
  DIALOG_SUBMIT_APP_SAVE_REQUEST,
  DIALOG_SUBMIT_APP_SAVE_SUCCESS,
} from '../../constants/actions';

export const close = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_SUBMIT_APP_CLOSE });
  };

export const formUpdate = changes =>
  (dispatch) => {
    dispatch({
      type: DIALOG_SUBMIT_APP_FORM_UPDATE,
      changes,
    });
  };

export const open = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_SUBMIT_APP_OPEN });
  };

export const save = () =>
  (dispatch) => {
    dispatch({ type: DIALOG_SUBMIT_APP_SAVE_REQUEST });
    setTimeout(() => {
      dispatch({ type: DIALOG_SUBMIT_APP_SAVE_SUCCESS });
      dispatch({ type: DIALOG_SUBMIT_APP_CLOSE });
    }, 1000);
  };
