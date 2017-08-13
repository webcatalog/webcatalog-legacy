import { openSnackbar } from '../../main/snackbar/actions';

import {
  dialogFeedbackClose,
  dialogFeedbackOpen,
  dialogFeedbackFormUpdate,
  dialogFeedbackSaveRequest,
  dialogFeedbackSaveSuccess,
} from './action-creators';

import { apiPost } from '../../api';

const hasErrors = (validatedChanges) => {
  if (validatedChanges.contentError) {
    return true;
  }
  return false;
};

const validate = (data) => {
  const {
    content,
  } = data;

  const newData = data;

  if (content || content === '') {
    const key = content;
    if (key.length > 1000) newData.contentError = 'Must be under 1000 characters';
    else newData.contentError = null;
  }

  return newData;
};

export const close = () =>
  (dispatch) => {
    dispatch(dialogFeedbackClose());
  };

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getState());
    dispatch(dialogFeedbackFormUpdate(validatedChanges));
  };

export const open = () =>
  (dispatch) => {
    dispatch(dialogFeedbackOpen());
  };

export const save = () =>
  (dispatch, getState) => {
    const data = getState().dialogs.feedback.form;

    const validatedChanges = validate(data, getState());
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
