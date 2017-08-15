import validate from '../../../utils/validate';

import { openSnackbar } from '../../root/snackbar/actions';

import {
  dialogFeedbackClose,
  dialogFeedbackOpen,
  dialogFeedbackFormUpdate,
  dialogFeedbackSaveRequest,
  dialogFeedbackSaveSuccess,
} from './action-creators';

import { apiPost } from '../../api';

const getValidationRules = () => ({
  content: {
    required: true,
    maxLength: 1000,
  },
});

const hasErrors = (validatedChanges) => {
  if (validatedChanges.contentError) {
    return true;
  }
  return false;
};

export const close = () =>
  (dispatch) => {
    dispatch(dialogFeedbackClose());
  };

export const formUpdate = changes =>
  (dispatch) => {
    const validatedChanges = validate(changes, getValidationRules());
    dispatch(dialogFeedbackFormUpdate(validatedChanges));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogFeedbackOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().dialogs.feedback.form;

    const validatedChanges = validate(data, getValidationRules());
    if (hasErrors(validatedChanges)) {
      return dispatch(formUpdate(validatedChanges));
    }

    dispatch(dialogFeedbackSaveRequest());
    return dispatch(apiPost('/feedback', data))
      .then(() => {
        dispatch(dialogFeedbackSaveSuccess());
        dispatch(openSnackbar(
          'Your feedback has been sent!',
          'Got it!',
        ));
        dispatch(dialogFeedbackClose());
      });
  };
