import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogAccountPasswordFormUpdate,
  dialogAccountPasswordSaveRequest,
  dialogAccountPasswordSaveSuccess,
} from './action-creators';

export const formUpdate = changes =>
  dispatch => dispatch(dialogAccountPasswordFormUpdate(changes));

export const save = () =>
  (dispatch) => {
    dispatch(dialogAccountPasswordSaveRequest());
    setTimeout(() => {
      dispatch(dialogAccountPasswordSaveSuccess());
      dispatch(openSnackbar(
        'Your password has been saved!',
        'Close',
      ));
    }, 1000);
  };
