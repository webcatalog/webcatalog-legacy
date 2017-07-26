import { openSnackbar } from '../../snackbar/actions';

import {
  dialogSubmitAppClose,
  dialogSubmitAppOpen,
  dialogSubmitAppFormUpdate,
  dialogSubmitAppSaveRequest,
  dialogSubmitAppSaveSuccess,
} from './action-creators';

export const close = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppClose());
  };

export const formUpdate = changes =>
  (dispatch) => {
    dispatch(dialogSubmitAppFormUpdate(changes));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppOpen());
  };

export const save = () =>
  (dispatch) => {
    dispatch(dialogSubmitAppSaveRequest());
    setTimeout(() => {
      dispatch(dialogSubmitAppSaveSuccess());
      dispatch(openSnackbar(
        'Thanks! Your app has been submitted for review!',
        'Got it!',
      ));
      dispatch(dialogSubmitAppClose());
    }, 1000);
  };
