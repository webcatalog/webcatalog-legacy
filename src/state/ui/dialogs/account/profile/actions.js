import { openSnackbar } from '../../../snackbar/actions';

import {
  dialogAccountProfileFormUpdate,
  dialogAccountProfileSaveRequest,
  dialogAccountProfileSaveSuccess,
} from './action-creators';

export const formUpdate = changes =>
  dispatch => dispatch(dialogAccountProfileFormUpdate(changes));

export const save = () =>
  (dispatch) => {
    dispatch(dialogAccountProfileSaveRequest());
    setTimeout(() => {
      dispatch(dialogAccountProfileSaveSuccess());
      dispatch(openSnackbar(
        'Your profile has been saved!',
        'Close',
      ));
    }, 1000);
  };
